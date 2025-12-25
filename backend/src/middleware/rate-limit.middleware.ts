import { NextFunction, Request, Response } from "express";
import { TooManyRequestsError } from "../utils/error.util";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private getKey(req: Request): string {
    // Use IP address or user ID if authenticated
    const userId = (req as any).user?.userId;
    return userId
      ? `user:${userId}`
      : `ip:${req.ip || req.socket.remoteAddress}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = this.getKey(req);
      const now = Date.now();

      if (!this.store[key] || this.store[key].resetTime < now) {
        // Initialize or reset window
        this.store[key] = {
          count: 1,
          resetTime: now + this.config.windowMs,
        };
        return next();
      }

      // Increment count
      this.store[key].count++;

      if (this.store[key].count > this.config.maxRequests) {
        const resetTime = new Date(this.store[key].resetTime);
        res.setHeader(
          "Retry-After",
          Math.ceil((this.store[key].resetTime - now) / 1000)
        );
        res.setHeader("X-RateLimit-Limit", this.config.maxRequests.toString());
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("X-RateLimit-Reset", resetTime.toISOString());

        return next(
          new TooManyRequestsError(
            this.config.message ||
              `Too many requests, please try again after ${resetTime.toISOString()}`
          )
        );
      }

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", this.config.maxRequests.toString());
      res.setHeader(
        "X-RateLimit-Remaining",
        (this.config.maxRequests - this.store[key].count).toString()
      );
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(this.store[key].resetTime).toISOString()
      );

      next();
    };
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // General API rate limit: 100 requests per 15 minutes
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    message: "Too many requests. Please try again later.",
  }),

  // Strict rate limit: 10 requests per minute
  strict: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: "Rate limit exceeded. Please slow down.",
  }),

  // Auth endpoints: 5 requests per minute
  auth: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
    message: "Too many authentication attempts. Please try again later.",
  }),

  // Admin endpoints: 200 requests per 15 minutes
  admin: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 200,
    message: "Admin rate limit exceeded.",
  }),
};

// Helper to create custom rate limiter
export const createRateLimiter = (config: RateLimitConfig) => {
  return new RateLimiter(config);
};
