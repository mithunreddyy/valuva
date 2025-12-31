import { getRedis } from "../config/redis";
import { logger } from "./logger.util";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Cache utility using Redis or in-memory fallback
 * Production-ready caching with TTL support
 */
export class CacheUtil {
  private static memoryCache = new Map<string, CacheEntry<unknown>>();
  private static readonly DEFAULT_TTL = 3600; // 1 hour in seconds

  /**
   * Get value from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    const redis = getRedis();

    if (redis) {
      try {
        const value = await redis.get(key);
        if (value) {
          return JSON.parse(value) as T;
        }
      } catch (error) {
        logger.error("Redis get error", {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Fallback to memory cache
    const entry = this.memoryCache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.data as T;
    }

    if (entry) {
      this.memoryCache.delete(key);
    }

    return null;
  }

  /**
   * Set value in cache
   */
  static async set<T>(
    key: string,
    value: T,
    ttl: number = this.DEFAULT_TTL
  ): Promise<void> {
    const redis = getRedis();

    if (redis) {
      try {
        await redis.setex(key, ttl, JSON.stringify(value));
        return;
      } catch (error) {
        logger.error("Redis set error", {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Fallback to memory cache
    this.memoryCache.set(key, {
      data: value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  /**
   * Delete value from cache
   */
  static async delete(key: string): Promise<void> {
    const redis = getRedis();

    if (redis) {
      try {
        await redis.del(key);
      } catch (error) {
        logger.error("Redis delete error", {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    this.memoryCache.delete(key);
  }

  /**
   * Delete multiple keys matching pattern
   */
  static async deletePattern(pattern: string): Promise<void> {
    const redis = getRedis();

    if (redis) {
      try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } catch (error) {
        logger.error("Redis delete pattern error", {
          pattern,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Fallback: delete from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern.replace("*", ""))) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<void> {
    const redis = getRedis();

    if (redis) {
      try {
        await redis.flushdb();
      } catch (error) {
        logger.error("Redis clear error", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    this.memoryCache.clear();
  }

  /**
   * Get or set with callback (cache-aside pattern)
   */
  static async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Generate a cache key from multiple parts
   * Filters out null/undefined values and joins with colon separator
   */
  static generateKey(...parts: (string | number | undefined | null)[]): string {
    return parts.filter((part) => part != null).join(":");
  }
}
