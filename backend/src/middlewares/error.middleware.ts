/**
 * Error Handling Middleware
 * ------------------------------------
 * Centralized error handling with logging and user-friendly messages
 */

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

/**
 * Custom Error Class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Handler Wrapper
 * Eliminates need for try-catch in controllers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global Error Handler
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = undefined;

  // Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Prisma Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = `Duplicate entry: ${(err.meta?.target as string[])?.join(
          ", "
        )} already exists`;
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003":
        statusCode = 400;
        message = "Invalid reference or foreign key constraint failed";
        break;
      case "P2014":
        statusCode = 400;
        message = "Invalid relation query";
        break;
      default:
        statusCode = 400;
        message = "Database operation failed";
    }
  }

  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided";
  }

  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Validation Errors (from Joi or other validators)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // Multer File Upload Errors
  else if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ ERROR:", {
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

/**
 * Specific Error Handlers
 */
export const handleNotAuthorized = () => {
  throw new AppError("Not authorized to access this resource", 403);
};

export const handleNotAuthenticated = () => {
  throw new AppError("Authentication required", 401);
};

export const handleBadRequest = (message: string = "Bad request") => {
  throw new AppError(message, 400);
};

export const handleNotFound = (resource: string = "Resource") => {
  throw new AppError(`${resource} not found`, 404);
};

export const handleConflict = (message: string = "Resource already exists") => {
  throw new AppError(message, 409);
};

/**
 * PayU Specific Error Handler
 */
export const handlePayUError = (
  message: string = "Payment processing failed"
) => {
  throw new AppError(message, 402);
};

/**
 * Database Transaction Error Handler
 */
export const handleTransactionError = () => {
  throw new AppError("Transaction failed. Please try again", 500);
};
