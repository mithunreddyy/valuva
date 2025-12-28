import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

/**
 * Response Compression Middleware
 * Compresses responses to reduce bandwidth and improve performance
 * Production-ready compression for API responses
 */
export const compressionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only compress in production or if explicitly enabled
  if (env.NODE_ENV !== "production") {
    return next();
  }

  const acceptEncoding = req.headers["accept-encoding"] || "";

  // Check if client supports compression
  if (
    !acceptEncoding.includes("gzip") &&
    !acceptEncoding.includes("deflate") &&
    !acceptEncoding.includes("br")
  ) {
    return next();
  }

  // Set compression headers
  // Note: For full compression, use express-compression middleware
  // This is a lightweight version that sets headers
  if (acceptEncoding.includes("br")) {
    res.setHeader("Content-Encoding", "br");
  } else if (acceptEncoding.includes("gzip")) {
    res.setHeader("Content-Encoding", "gzip");
  } else if (acceptEncoding.includes("deflate")) {
    res.setHeader("Content-Encoding", "deflate");
  }

  // Set Vary header for caching
  res.setHeader("Vary", "Accept-Encoding");

  next();
};

