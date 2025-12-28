import { logger } from "../utils/logger.util";
import { processAllStockAlerts } from "./stock-alerts.job";

/**
 * Job Scheduler
 * Handles periodic background jobs
 * In production, use a proper job scheduler like node-cron or Bull Board
 */

let intervalIds: NodeJS.Timeout[] = [];

/**
 * Initialize scheduled jobs
 */
export const initScheduler = (): void => {
  // Process stock alerts every hour
  const stockAlertInterval = setInterval(
    async () => {
      try {
        await processAllStockAlerts();
      } catch (error) {
        logger.error("Scheduled stock alert job failed", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    60 * 60 * 1000
  ); // 1 hour

  intervalIds.push(stockAlertInterval);

  logger.info("Job scheduler initialized", {
    jobs: ["stock-alerts"],
    intervals: ["1 hour"],
  });
};

/**
 * Stop all scheduled jobs
 */
export const stopScheduler = (): void => {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
  logger.info("Job scheduler stopped");
};
