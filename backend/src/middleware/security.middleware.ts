import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.util";

/**
 * CSRF Protection Middleware
 * Validates CSRF token for state-changing requests
 * Production: Use proper CSRF token generation and validation
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip CSRF for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip CSRF for webhook endpoints (validated by secret)
  if (req.path.includes("/webhook") || req.path.includes("/payments/webhook")) {
    return next();
  }

  // Get CSRF token from header or cookie
  const token = req.headers["x-csrf-token"] as string || req.cookies?.["csrf-token"];
  const sessionToken = (req as any).session?.["csrfToken"];

  // In production, validate token against session
  // For now, check if token exists (proper implementation requires session management)
  if (!token && process.env.NODE_ENV === "production") {
    logger.warn("CSRF token missing", {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    res.status(403).json({
      success: false,
      message: "CSRF token missing or invalid",
    });
    return;
  }

  // Validate token matches session token
  if (token && sessionToken && token !== sessionToken && process.env.NODE_ENV === "production") {
    logger.warn("CSRF token mismatch", {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    res.status(403).json({
      success: false,
      message: "CSRF token validation failed",
    });
    return;
  }

  next();
};

/**
 * Content Security Policy Headers
 * Restricts resource loading to prevent XSS attacks
 */
export const cspHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Production CSP - strict policy
  const csp = process.env.NODE_ENV === "production"
    ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;";

  res.setHeader("Content-Security-Policy", csp);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};

/**
 * Input Sanitization Middleware
 * Removes potentially dangerous characters and patterns
 */
export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const sanitize = (obj: any): any => {
    if (typeof obj === "string") {
      // Remove script tags and event handlers
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
        .replace(/javascript:/gi, "")
        .trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize request body
  if (req.body && typeof req.body === "object") {
    req.body = sanitize(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === "object") {
    req.query = sanitize(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === "object") {
    req.params = sanitize(req.params);
  }

  next();
};

