import { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";

/**
 * Middleware to add a unique request ID to each request
 * Useful for tracing requests across services and logs
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Use existing X-Request-ID header or generate a new one
  const requestId =
    (req.headers["x-request-id"] as string) ||
    randomBytes(16).toString("hex");

  // Add to request object
  (req as any).id = requestId;

  // Set response header
  res.setHeader("X-Request-ID", requestId);

  next();
};

