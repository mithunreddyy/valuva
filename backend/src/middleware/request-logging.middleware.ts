/**
 * Request/Response Logging Middleware
 * Production-ready structured logging for debugging and monitoring
 * Logs request details, response status, and performance metrics
 */

import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.util";
import { getPerformanceMetrics } from "./performance.middleware";

interface LogContext extends Record<string, unknown> {
  method: string;
  path: string;
  query?: Record<string, unknown>;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  userId?: string;
  requestId?: string;
  bodySize?: number;
  responseSize?: number;
}

/**
 * Request logging middleware
 * Logs all incoming requests with structured data
 */
export const requestLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  interface RequestWithUser extends Request {
    user?: { id: string };
    requestId?: string;
  }

  const authReq = req as RequestWithUser;
  const context: LogContext = {
    method: req.method,
    path: req.path,
    query: req.query as Record<string, unknown>,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get("user-agent"),
    requestId: authReq.requestId,
  };

  // Add user ID if authenticated
  if (authReq.user) {
    context.userId = authReq.user.id;
  }

  // Calculate request body size
  if (req.body) {
    try {
      context.bodySize = JSON.stringify(req.body).length;
    } catch {
      // Ignore serialization errors
    }
  }

  // Log request
  if (process.env.NODE_ENV === "development") {
    logger.debug("Incoming request", context);
  }

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = function (body: unknown) {
    const performance = getPerformanceMetrics(req);
    const duration = performance?.duration || Date.now() - startTime;

    const responseContext: LogContext = {
      ...context,
      statusCode: res.statusCode,
      duration,
    };

    // Calculate response size
    try {
      responseContext.responseSize = JSON.stringify(body).length;
    } catch {
      // Ignore serialization errors
    }

    // Log response based on status code
    if (res.statusCode >= 500) {
      logger.error("Request failed", responseContext);
    } else if (res.statusCode >= 400) {
      logger.warn("Request error", responseContext);
    } else if (process.env.NODE_ENV === "development") {
      logger.debug("Request completed", responseContext);
    } else {
      // In production, only log important requests
      if (duration > 1000 || context.method !== "GET") {
        logger.info("Request completed", responseContext);
      }
    }

    return originalJson(body);
  };

  next();
};

