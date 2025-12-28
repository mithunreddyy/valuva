import { NextFunction, Request, Response } from "express";
import { InputSanitizer } from "../utils/input-sanitizer.util";
import { logger } from "../utils/logger.util";

/**
 * Enhanced Validation Middleware
 * Sanitizes and validates all incoming request data
 * Production-ready input validation and sanitization
 */
export const validationMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = InputSanitizer.sanitizeObject(req.query as any, {
        maxDepth: 3,
        allowHtml: false,
      }) as any;
    }

    // Sanitize body parameters
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = InputSanitizer.sanitizeObject(req.body, {
        maxDepth: 10,
        allowHtml: false,
      });
    }

    // Sanitize params
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = InputSanitizer.sanitizeObject(req.params, {
        maxDepth: 2,
        allowHtml: false,
      }) as any;
    }

    next();
  } catch (error) {
    logger.error("Validation middleware error", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
};

