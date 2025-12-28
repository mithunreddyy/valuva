import Queue from "bull";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { getRedis } from "../config/redis";
import { StockAlertsService } from "../modules/stock-alerts/stock-alerts.service";
import { logger } from "../utils/logger.util";

/**
 * Background job queue for stock alerts
 * Processes stock alerts and sends notifications when products are back in stock
 */
let stockAlertQueue: Queue.Queue | null = null;

export const initStockAlertQueue = (): Queue.Queue | null => {
  if (stockAlertQueue) {
    return stockAlertQueue;
  }

  const redis = getRedis();
  if (!redis) {
    logger.warn("Redis not available. Stock alert jobs will be disabled.");
    return null;
  }

  stockAlertQueue = new Queue("stock-alerts", {
    redis: {
      host: env.REDIS_HOST || "localhost",
      port: env.REDIS_PORT || 6379,
      password: env.REDIS_PASSWORD,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  // Process stock alert jobs
  stockAlertQueue.process(async (job) => {
    const { productId } = job.data;
    const stockAlertsService = new StockAlertsService();

    try {
      await stockAlertsService.checkAndNotifyStockAlerts(productId);
      logger.info("Stock alert job processed", { productId });
    } catch (error) {
      logger.error("Stock alert job failed", {
        productId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  });

  stockAlertQueue.on("completed", (job) => {
    logger.debug("Stock alert job completed", { jobId: job.id });
  });

  stockAlertQueue.on("failed", (job, error) => {
    logger.error("Stock alert job failed", {
      jobId: job?.id,
      error: error.message,
    });
  });

  logger.info("Stock alert queue initialized");
  return stockAlertQueue;
};

/**
 * Add stock alert check job to queue
 */
export const addStockAlertJob = (
  productId: string,
  delay: number = 0
): void => {
  const queue = initStockAlertQueue();
  if (!queue) {
    logger.warn("Stock alert queue not available");
    return;
  }

  queue.add(
    { productId },
    {
      delay,
      jobId: `stock-alert-${productId}-${Date.now()}`,
    }
  );
};

/**
 * Process stock alerts for all products (scheduled job)
 * Should be called periodically (e.g., every hour via cron)
 */
export const processAllStockAlerts = async (): Promise<void> => {
  try {
    // Get all products with stock alerts
    const productsWithAlerts = await prisma.stockAlert.findMany({
      select: {
        productId: true,
      },
      distinct: ["productId"],
    });

    logger.info("Processing stock alerts", {
      count: productsWithAlerts.length,
    });

    const stockAlertsService = new StockAlertsService();

    // Process each product
    for (const alert of productsWithAlerts) {
      try {
        await stockAlertsService.checkAndNotifyStockAlerts(alert.productId);
      } catch (error) {
        logger.error("Failed to process stock alert", {
          productId: alert.productId,
          error: error instanceof Error ? error.message : String(error),
        });
        // Continue with other products
      }
    }

    logger.info("Stock alerts processing completed");
  } catch (error) {
    logger.error("Stock alerts batch processing failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Close stock alert queue
 */
export const closeStockAlertQueue = async (): Promise<void> => {
  if (stockAlertQueue) {
    await stockAlertQueue.close();
    stockAlertQueue = null;
    logger.info("Stock alert queue closed");
  }
};
