/**
 * Webhook Retry Utility
 * Production-ready webhook retry mechanism with exponential backoff
 * Ensures reliable delivery of payment and external service webhooks
 */

import Queue from "bull";
import { getRedis } from "../config/redis";
import { env } from "../config/env";
import { logger } from "./logger.util";

export interface WebhookPayload {
  url: string;
  method: "POST" | "PUT" | "PATCH";
  headers: Record<string, string>;
  body: unknown;
  signature?: string;
  metadata?: {
    source: string; // e.g., "razorpay", "stripe"
    eventType: string;
    orderId?: string;
    paymentId?: string;
  };
}

let webhookQueue: Queue.Queue | null = null;

/**
 * Initialize webhook retry queue
 */
export const initWebhookQueue = (): Queue.Queue | null => {
  if (webhookQueue) {
    return webhookQueue;
  }

  const redis = getRedis();
  if (!redis) {
    logger.warn("Redis not available. Webhook retry queue will be disabled.");
    return null;
  }

  webhookQueue = new Queue("webhooks", {
    redis: {
      host: env.REDIS_HOST || "localhost",
      port: env.REDIS_PORT || 6379,
      password: env.REDIS_PASSWORD,
    },
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 2000, // Start with 2 seconds
      },
      removeOnComplete: true,
      removeOnFail: false, // Keep failed jobs for manual inspection
    },
  });

  // Process webhook jobs
  webhookQueue.process(async (job) => {
    const payload: WebhookPayload = job.data;

    try {
      // Use axios for better compatibility
      const axios = require("axios");
      const response = await axios.request({
        method: payload.method,
        url: payload.url,
        headers: {
          "Content-Type": "application/json",
          ...payload.headers,
        },
        data: payload.body,
        timeout: 10000, // 10 second timeout
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `Webhook delivery failed: ${response.status}`
        );
      }

      logger.info("Webhook delivered successfully", {
        url: payload.url,
        source: payload.metadata?.source,
        eventType: payload.metadata?.eventType,
        attempt: job.attemptsMade + 1,
      });

      return { success: true, status: response.status };
    } catch (error) {
      logger.error("Webhook delivery failed", {
        url: payload.url,
        source: payload.metadata?.source,
        eventType: payload.metadata?.eventType,
        attempt: job.attemptsMade + 1,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  });

  webhookQueue.on("completed", (job) => {
    logger.debug("Webhook job completed", {
      jobId: job.id,
      source: job.data.metadata?.source,
    });
  });

  webhookQueue.on("failed", (job, error) => {
    logger.error("Webhook job failed permanently", {
      jobId: job?.id,
      url: job?.data?.url,
      source: job?.data?.metadata?.source,
      attempts: job?.attemptsMade,
      error: error.message,
    });
  });

  logger.info("Webhook retry queue initialized");
  return webhookQueue;
};

/**
 * Queue webhook for delivery with retry
 */
export const queueWebhook = (payload: WebhookPayload, delay: number = 0): void => {
  if (!webhookQueue) {
    logger.warn("Webhook queue not initialized. Webhook will not be retried.");
    return;
  }

  webhookQueue.add(payload, {
    delay,
    jobId: `${payload.metadata?.source}-${payload.metadata?.eventType}-${Date.now()}`,
  });

  logger.info("Webhook queued for delivery", {
    url: payload.url,
    source: payload.metadata?.source,
    eventType: payload.metadata?.eventType,
    delay,
  });
};

/**
 * Close webhook queue
 */
export const closeWebhookQueue = async (): Promise<void> => {
  if (webhookQueue) {
    await webhookQueue.close();
    webhookQueue = null;
    logger.info("Webhook queue closed");
  }
};

