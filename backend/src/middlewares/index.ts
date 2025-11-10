/**
 * Middleware Index
 * ------------------------------------
 * Central export point for all middlewares
 */

// Authentication & Authorization
export * from "./admin.middleware";
export * from "./auth.middleware";

// Validation & Sanitization
export * from "./validate.middleware";

// Error Handling
export * from "./error.middleware";

// Logging
export * from "./logger.middleware";

// Rate Limiting & Security
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

/**
 * Rate Limiting Configurations
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  skipSuccessfulRequests: true,
});

export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 orders per hour
  message: {
    success: false,
    message: "Order limit exceeded, please try again later",
  },
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: "Rate limit exceeded",
  },
});

/**
 * Security Middleware
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * CORS Configuration
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);

/**
 * Request Parsing Middleware
 */
import express from "express";

export const jsonParser = express.json({ limit: "10mb" });
export const urlencodedParser = express.urlencoded({
  extended: true,
  limit: "10mb",
});

/**
 * File Upload Middleware
 */
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDFs are allowed"));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

/**
 * Cache Middleware
 */
export const cacheMiddleware = (duration: number = 300) => {
  return (req: any, res: any, next: any) => {
    if (req.method !== "GET") {
      return next();
    }

    res.set("Cache-Control", `public, max-age=${duration}`);
    next();
  };
};

/**
 * Request ID Middleware
 */
export const requestId = (req: any, res: any, next: any) => {
  req.id = req.get("X-Request-ID") || Math.random().toString(36).substring(7);
  res.set("X-Request-ID", req.id);
  next();
};

/**
 * Compression Middleware
 */
import compression from "compression";

export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
});
