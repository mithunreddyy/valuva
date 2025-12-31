/**
 * Response Cache Middleware
 * Production-ready HTTP response caching with ETag support
 * Reduces server load and improves response times
 */

import { NextFunction, Request, Response } from "express";
import { createHash } from "crypto";
import { CacheUtil } from "../utils/cache.util";
import { logger } from "../utils/logger.util";

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  vary?: string[]; // Headers that affect cache key
  skipCache?: (req: Request) => boolean; // Function to skip caching
}

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Response cache middleware factory
 */
export const responseCacheMiddleware = (options: CacheOptions = {}) => {
  const {
    ttl = DEFAULT_TTL,
    vary = [],
    skipCache = () => false,
  } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip caching if function returns true
    if (skipCache(req)) {
      return next();
    }

    // Skip caching for authenticated admin routes
    interface RequestWithUser extends Request {
      user?: { id: string };
    }
    if (req.path.startsWith("/api/v1/admin") && (req as RequestWithUser).user) {
      return next();
    }

    // Generate cache key
    const cacheKey = generateCacheKey(req, vary);

    // Check for ETag in request
    const ifNoneMatch = req.headers["if-none-match"];
    if (ifNoneMatch) {
      const cached = await CacheUtil.get<string>(`etag:${cacheKey}`);
      if (cached === ifNoneMatch) {
        res.status(304).end();
        return;
      }
    }

    // Check cache
    interface CachedResponse {
      data: unknown;
      etag: string;
    }
    const cached = await CacheUtil.get<CachedResponse>(cacheKey);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("ETag", cached.etag);
      res.setHeader("Cache-Control", `public, max-age=${ttl}`);
      res.json(cached.data);
      return;
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (body: unknown) {
      const etag = generateETag(body);
      res.setHeader("X-Cache", "MISS");
      res.setHeader("ETag", etag);
      res.setHeader("Cache-Control", `public, max-age=${ttl}`);

      // Cache the response
      CacheUtil.set(cacheKey, { data: body, etag }, ttl).catch((error) => {
        logger.error("Failed to cache response", {
          error: error instanceof Error ? error.message : String(error),
          cacheKey,
        });
      });

      // Cache ETag separately for 304 checks
      CacheUtil.set(`etag:${cacheKey}`, etag, ttl).catch(() => {
        // Ignore ETag cache errors
      });

      return originalJson(body);
    };

    next();
  };
};

/**
 * Generate cache key from request
 */
function generateCacheKey(req: Request, vary: string[]): string {
  const parts = [
    req.method,
    req.path,
    JSON.stringify(req.query),
  ];

  // Include vary headers in cache key
  for (const header of vary) {
    const value = req.headers[header.toLowerCase()];
    if (value) {
      parts.push(`${header}:${value}`);
    }
  }

  const keyString = parts.join("|");
  return createHash("md5").update(keyString).digest("hex");
}

/**
 * Generate ETag from response body
 */
function generateETag(body: unknown): string {
  const bodyString = JSON.stringify(body);
  return createHash("md5").update(bodyString).digest("hex");
}

