import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger.util";

let redisClient: Redis | null = null;

/**
 * Initialize Redis client for caching and background jobs
 * Falls back gracefully if Redis is not available
 */
export const initRedis = (): Redis | null => {
  if (redisClient) {
    return redisClient;
  }

  try {
    if (env.REDIS_URL) {
      redisClient = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            logger.warn("Redis connection failed after multiple retries");
            return null; // Stop retrying
          }
          return Math.min(times * 200, 2000);
        },
      });
    } else if (env.REDIS_HOST) {
      redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT || 6379,
        password: env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            logger.warn("Redis connection failed after multiple retries");
            return null;
          }
          return Math.min(times * 200, 2000);
        },
      });
    } else {
      logger.warn("Redis not configured. Caching and background jobs will be disabled.");
      return null;
    }

    redisClient.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    redisClient.on("error", (error) => {
      logger.error("Redis connection error", {
        error: error.message,
      });
      // Don't throw - allow app to continue without Redis
    });

    return redisClient;
  } catch (error) {
    logger.error("Failed to initialize Redis", {
      error: error instanceof Error ? error.message : String(error),
    });
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

