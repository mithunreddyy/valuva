import { Response } from "express";
import { HTTP_STATUS } from "../config/constants";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK,
    meta?: ApiResponse["meta"]
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response {
    return this.success(res, data, message, HTTP_STATUS.OK, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }
}
