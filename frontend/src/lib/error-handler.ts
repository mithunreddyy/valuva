import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "./constants";

/**
 * Error handling utilities
 * Provides consistent error handling and formatting across the application
 */

/**
 * Extract error message from various error types
 * @param error - Error object (AxiosError, Error, or unknown)
 * @returns Formatted error message string
 */
export function getErrorMessage(error: unknown): string {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    // Check for response error with message
    if (error.response?.data) {
      const data = error.response.data as any;
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return "Bad request. Please check your input.";
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 409:
        return "This resource already exists.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        if (error.message) {
          return error.message;
        }
    }

    // Network errors
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }
    if (error.code === "ERR_NETWORK") {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Default fallback
  return "An unexpected error occurred. Please try again.";
}

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns true if network error, false otherwise
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      !error.response
    );
  }
  return false;
}

/**
 * Check if error is an authentication error
 * @param error - Error object
 * @returns true if authentication error, false otherwise
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
}

/**
 * Check if error is a validation error
 * @param error - Error object
 * @returns true if validation error, false otherwise
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 400 || error.response?.status === 422;
  }
  return false;
}

/**
 * Format error for display in UI
 * @param error - Error object
 * @param fallbackMessage - Fallback message if error cannot be parsed
 * @returns User-friendly error message
 */
export function formatError(
  error: unknown,
  fallbackMessage: string = ERROR_MESSAGES.SERVER_ERROR
): string {
  const message = getErrorMessage(error);
  return message || fallbackMessage;
}

/**
 * Log error to console (and potentially to error tracking service)
 * @param error - Error object
 * @param context - Additional context about where error occurred
 */
export function logError(error: unknown, context?: string): void {
  const message = getErrorMessage(error);
  const errorInfo = {
    message,
    context,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.stack : String(error),
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error occurred:", errorInfo);
  }

  // In production, you might want to send to error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

