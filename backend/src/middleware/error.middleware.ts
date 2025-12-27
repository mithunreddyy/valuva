import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../config/constants";
import { AppError } from "../utils/error.util";
import { logger } from "../utils/logger.util";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.headers["x-request-id"] || "unknown";

  if (err instanceof AppError) {
    logger.warn("Application Error", {
      requestId,
      statusCode: err.statusCode,
      message: err.message,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error("Prisma Error", {
      requestId,
      code: err.code,
      meta: err.meta,
      path: req.path,
    });

    if (err.code === "P2002") {
      const target = (err.meta?.target as string[]) || [];
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: `Duplicate entry: ${target.join(", ")} already exists`,
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Resource not found",
      });
      return;
    }

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Database operation failed",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error("Validation Error", {
      requestId,
      message: err.message,
      path: req.path,
    });

    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
    return;
  }

  logger.error("Unhandled Error", {
    requestId,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
