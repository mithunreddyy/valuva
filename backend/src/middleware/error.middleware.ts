import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../config/constants";
import { AppError } from "../utils/error.util";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.name === "P2002") {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: "Resource already exists",
      });
      return;
    }
    if (err.name === "NotFoundError") {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Resource not found",
      });
      return;
    }
  }

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
