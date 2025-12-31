/**
 * Metrics Middleware
 * Tracks HTTP request metrics for Prometheus monitoring
 */

import { NextFunction, Request, Response } from "express";
import { MetricsUtil } from "../utils/metrics.util";
import { getPerformanceMetrics } from "./performance.middleware";

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const performance = getPerformanceMetrics(req);

    MetricsUtil.trackHttpRequest(
      req.method,
      req.path,
      res.statusCode,
      performance?.duration || duration
    );
  });

  next();
};

