import { createApp } from "./app";
import { prisma } from "./config/database";
import { env } from "./config/env";
import { initRedis, closeRedis, getRedis } from "./config/redis";
import { initSentry } from "./config/sentry";
import { initEmailQueue, closeEmailQueue } from "./jobs/email-queue.job";
import { initStockAlertQueue, closeStockAlertQueue } from "./jobs/stock-alerts.job";
import { initScheduler, stopScheduler } from "./jobs/scheduler";
import { logger } from "./utils/logger.util";

// Initialize Sentry before anything else
initSentry();

const app = createApp();

const startServer = async () => {
  try {
    // Initialize Redis
    initRedis();

    // Initialize background job queues
    initStockAlertQueue();
    initEmailQueue();

    // Initialize scheduled jobs
    initScheduler();

    // Connect to database
    await prisma.$connect();
    logger.info("Database connected successfully");

    app.listen(env.PORT, () => {
      logger.info("Server started", {
        port: env.PORT,
        environment: env.NODE_ENV,
        apiUrl: `http://localhost:${env.PORT}/api/v1`,
        redis: getRedis() ? "connected" : "disabled",
        sentry: env.SENTRY_DSN ? "enabled" : "disabled",
      });
    });
  } catch (error) {
    logger.error("Failed to start server", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  logger.info("Initiating graceful shutdown");
  
  // Stop scheduled jobs
  stopScheduler();
  
  // Close background job queues
  await closeStockAlertQueue();
  await closeEmailQueue();
  
  // Close Redis connection
  await closeRedis();
  
  // Disconnect from database
  await prisma.$disconnect();
  logger.info("Database disconnected");
  
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startServer();
