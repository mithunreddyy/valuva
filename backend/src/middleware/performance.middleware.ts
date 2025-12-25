import { NextFunction, Request, Response } from "express";

interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  method: string;
  path: string;
  statusCode?: number;
}

/**
 * Middleware to track request performance metrics
 */
export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const metrics: PerformanceMetrics = {
    startTime,
    method: req.method,
    path: req.path,
  };

  // Store metrics in request object
  (req as any).performance = metrics;

  // Track when response finishes
  res.on("finish", () => {
    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    metrics.statusCode = res.statusCode;

    // Log slow requests (over 1 second)
    if (metrics.duration > 1000) {
      console.warn(
        `[PERFORMANCE] Slow request detected: ${metrics.method} ${metrics.path} - ${metrics.duration}ms`
      );
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[PERFORMANCE] ${metrics.method} ${metrics.path} - ${metrics.duration}ms - ${metrics.statusCode}`
      );
    }
  });

  next();
};

/**
 * Get performance metrics from request
 */
export const getPerformanceMetrics = (
  req: Request
): PerformanceMetrics | null => {
  return (req as any).performance || null;
};
