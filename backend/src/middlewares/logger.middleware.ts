import { NextFunction, Request, Response } from "express";

/**
 * Logger Middleware
 * -----------------
 * Logs incoming requests with method, path, and duration.
 * Useful for debugging and performance analysis.
 */

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.method}] ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}
