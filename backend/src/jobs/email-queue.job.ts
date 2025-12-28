import Queue from "bull";
import { getRedis } from "../config/redis";
import { env } from "../config/env";
import { EmailUtil, EmailOptions } from "../utils/email.util";
import { logger } from "../utils/logger.util";

/**
 * Email Queue for Failed Emails
 * Retries failed email sends in background
 * Production-ready email delivery with retry mechanism
 */
let emailQueue: Queue.Queue | null = null;

export const initEmailQueue = (): Queue.Queue | null => {
  if (emailQueue) {
    return emailQueue;
  }

  const redis = getRedis();
  if (!redis) {
    logger.warn("Redis not available. Email queue will be disabled.");
    return null;
  }

  emailQueue = new Queue("emails", {
    redis: {
      host: env.REDIS_HOST || "localhost",
      port: env.REDIS_PORT || 6379,
      password: env.REDIS_PASSWORD,
    },
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  // Process email jobs
  emailQueue.process(async (job) => {
    const emailData: EmailOptions = job.data;

    try {
      await EmailUtil.sendEmail(emailData);
      logger.info("Email sent from queue", {
        to: emailData.to,
        subject: emailData.subject,
        jobId: job.id,
      });
    } catch (error) {
      logger.error("Email job failed", {
        to: emailData.to,
        subject: emailData.subject,
        error: error instanceof Error ? error.message : String(error),
        attempt: job.attemptsMade,
      });
      throw error;
    }
  });

  emailQueue.on("completed", (job) => {
    logger.debug("Email job completed", { jobId: job.id });
  });

  emailQueue.on("failed", (job, error) => {
    logger.error("Email job failed permanently", {
      jobId: job?.id,
      to: job?.data?.to,
      error: error.message,
      attempts: job?.attemptsMade,
    });
  });

  logger.info("Email queue initialized");
  return emailQueue;
};

/**
 * Queue email for sending
 * Use this when email service is unavailable
 */
export const queueEmail = (emailData: EmailOptions): void => {
  const queue = initEmailQueue();
  if (!queue) {
    logger.warn("Email queue not available, email will be lost", {
      to: emailData.to,
      subject: emailData.subject,
    });
    return;
  }

  queue.add(emailData, {
    jobId: `email-${emailData.to}-${Date.now()}`,
    priority: emailData.subject.toLowerCase().includes("order") ? 1 : 5, // Higher priority for order emails
  });

  logger.info("Email queued for retry", {
    to: emailData.to,
    subject: emailData.subject,
  });
};

/**
 * Close email queue
 */
export const closeEmailQueue = async (): Promise<void> => {
  if (emailQueue) {
    await emailQueue.close();
    emailQueue = null;
    logger.info("Email queue closed");
  }
};

