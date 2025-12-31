import Redis from "ioredis";
import { logger } from "../utils/logger.util";
import { env } from "./env";

let redisClient: Redis | null = null;
let connectionAttempted = false;
let connectionFailed = false;

/**
 * Initialize Redis client for caching and background jobs
 * Falls back gracefully if Redis is not available
 */
export const initRedis = (): Redis | null => {
  if (redisClient) {
    return redisClient;
  }

  if (connectionFailed) {
    return null; // Don't retry if we've already failed
  }

  // If Redis is not configured, skip initialization
  if (!env.REDIS_URL && !env.REDIS_HOST) {
    if (!connectionAttempted) {
      logger.info(
        "Redis not configured. Caching and background jobs will be disabled."
      );
      connectionAttempted = true;
    }
    return null;
  }

  try {
    connectionAttempted = true;

    if (env.REDIS_URL) {
      redisClient = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 1) {
            if (!connectionFailed) {
              logger.warn(
                "Redis connection failed. Caching and background jobs will be disabled."
              );
              connectionFailed = true;
            }
            return null; // Stop retrying
          }
          return Math.min(times * 200, 1000);
        },
        enableOfflineQueue: false, // Don't queue commands when offline
        connectTimeout: 2000, // 2 second timeout
        lazyConnect: false, // Connect immediately but handle errors gracefully
      });
    } else if (env.REDIS_HOST) {
      redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT || 6379,
        password: env.REDIS_PASSWORD,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 1) {
            if (!connectionFailed) {
              logger.warn(
                "Redis connection failed. Caching and background jobs will be disabled."
              );
              connectionFailed = true;
            }
            return null;
          }
          return Math.min(times * 200, 1000);
        },
        enableOfflineQueue: false,
        connectTimeout: 2000,
        lazyConnect: false,
      });
    }

    if (redisClient) {
      redisClient.on("connect", () => {
        logger.info("Redis connected successfully");
        connectionFailed = false;
      });

      redisClient.on("ready", () => {
        connectionFailed = false;
      });

      redisClient.on("error", (error) => {
        // Only log first error, then suppress
        if (!connectionFailed) {
          logger.warn(
            "Redis connection error. App will continue without Redis.",
            {
              error: error.message || "Connection failed",
            }
          );
          connectionFailed = true;
        }
        // Don't throw - allow app to continue without Redis
      });

      redisClient.on("close", () => {
        if (!connectionFailed) {
          connectionFailed = true;
        }
      });
    }

    return redisClient;
  } catch (error) {
    if (!connectionFailed) {
      logger.warn(
        "Failed to initialize Redis. App will continue without Redis.",
        {
          error: error instanceof Error ? error.message : String(error),
        }
      );
      connectionFailed = true;
    }
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedis = (): Redis | null => {
  if (!redisClient) {
    return initRedis();
  }
  return redisClient;
};

/**
 * Close Redis connection
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Redis connection closed");
  }
};
