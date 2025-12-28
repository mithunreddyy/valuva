import { NextFunction, Request, Response } from "express";
import { getRedis } from "../config/redis";
import { TooManyRequestsError } from "../utils/error.util";
import { logger } from "../utils/logger.util";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Redis-based Rate Limiting Middleware
 * Production-ready distributed rate limiting for multi-server deployments
 * Falls back to in-memory if Redis is unavailable
 */
class RedisRateLimiter {
  private config: RateLimitConfig;
  private memoryStore: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
    // Clean up memory store every 5 minutes
    setInterval(() => this.cleanupMemoryStore(), 5 * 60 * 1000);
  }

  private getKey(req: Request): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }

    // Default: Use user ID if authenticated, otherwise IP address
    const userId = (req as any).user?.userId;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    return userId ? `ratelimit:user:${userId}` : `ratelimit:ip:${ip}`;
  }

  private async getRedisCount(key: string): Promise<{ count: number; resetTime: number } | null> {
    const redis = getRedis();
    if (!redis) {
      return null;
    }

    try {
      const data = await redis.get(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      logger.warn("Redis rate limit get failed, falling back to memory", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return null;
  }

  private async setRedisCount(
    key: string,
    count: number,
    resetTime: number
  ): Promise<void> {
    const redis = getRedis();
    if (!redis) {
      return;
    }

    try {
      const ttl = Math.ceil((resetTime - Date.now()) / 1000);
      if (ttl > 0) {
        await redis.setex(key, ttl, JSON.stringify({ count, resetTime }));
      }
    } catch (error) {
      logger.warn("Redis rate limit set failed, falling back to memory", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private getMemoryCount(key: string): { count: number; resetTime: number } | null {
    return this.memoryStore.get(key) || null;
  }

  private setMemoryCount(key: string, count: number, resetTime: number): void {
    this.memoryStore.set(key, { count, resetTime });
  }

  private cleanupMemoryStore(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryStore.entries()) {
      if (value.resetTime < now) {
        this.memoryStore.delete(key);
      }
    }
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const key = this.getKey(req);
      const now = Date.now();

      // Try Redis first, fallback to memory
      let data = await this.getRedisCount(key);
      const isRedis = !!data;

      if (!data) {
        data = this.getMemoryCount(key);
      }

      if (!data || data.resetTime < now) {
        // Initialize new window
        const resetTime = now + this.config.windowMs;
        const newData = { count: 1, resetTime };

        if (isRedis || getRedis()) {
          await this.setRedisCount(key, 1, resetTime);
        } else {
          this.setMemoryCount(key, 1, resetTime);
        }

        this.setRateLimitHeaders(res, 1, this.config.maxRequests, resetTime);
        return next();
      }

      // Increment count
      const newCount = data.count + 1;

      if (newCount > this.config.maxRequests) {
        const resetTime = new Date(data.resetTime);
        res.setHeader("Retry-After", Math.ceil((data.resetTime - now) / 1000));
        this.setRateLimitHeaders(res, 0, this.config.maxRequests, data.resetTime);

        return next(
          new TooManyRequestsError(
            this.config.message ||
              `Too many requests, please try again after ${resetTime.toISOString()}`
          )
        );
      }

      // Update count
      if (isRedis || getRedis()) {
        await this.setRedisCount(key, newCount, data.resetTime);
      } else {
        this.setMemoryCount(key, newCount, data.resetTime);
      }

      this.setRateLimitHeaders(res, newCount, this.config.maxRequests, data.resetTime);
      next();
    };
  }

  private setRateLimitHeaders(
    res: Response,
    count: number,
    max: number,
    resetTime: number
  ): void {
    res.setHeader("X-RateLimit-Limit", max.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - count).toString());
    res.setHeader("X-RateLimit-Reset", new Date(resetTime).toISOString());
  }
}

// Export Redis-based rate limiters (same interface as memory-based)
export const redisRateLimiters = {
  general: new RedisRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    message: "Too many requests. Please try again later.",
  }),

  strict: new RedisRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: "Rate limit exceeded. Please slow down.",
  }),

  auth: new RedisRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
    message: "Too many authentication attempts. Please try again later.",
  }),

  admin: new RedisRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 200,
    message: "Admin rate limit exceeded.",
  }),
};

export const createRedisRateLimiter = (config: RateLimitConfig) => {
  return new RedisRateLimiter(config);
};

