import { logger } from "./logger.util";

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: "fixed" | "exponential";
  maxDelay?: number;
  retryable?: (error: any) => boolean;
}

/**
 * Retry utility for handling transient failures
 * Implements exponential backoff for retries
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = "exponential",
    maxDelay = 30000,
    retryable = (error) => {
      // Retry on network errors, timeouts, and 5xx errors
      if (error?.code === "ECONNRESET" || error?.code === "ETIMEDOUT") {
        return true;
      }
      if (error?.response?.status >= 500) {
        return true;
      }
      return false;
    },
  } = options;

  let lastError: any;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (attempt > 1) {
        logger.info("Retry succeeded", {
          attempt,
          maxAttempts,
        });
      }
      return result;
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (!retryable(error)) {
        logger.debug("Error is not retryable", {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        logger.error("Max retry attempts reached", {
          attempt,
          maxAttempts,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }

      // Calculate delay
      if (backoff === "exponential") {
        currentDelay = Math.min(currentDelay * 2, maxDelay);
      }

      logger.warn("Retrying operation", {
        attempt,
        maxAttempts,
        delay: currentDelay,
        error: error instanceof Error ? error.message : String(error),
      });

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
    }
  }

  throw lastError;
}

/**
 * Retry with jitter (random delay variation)
 * Prevents thundering herd problem
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const jitteredOptions = {
    ...options,
    delay: options.delay
      ? options.delay + Math.random() * 1000
      : 1000 + Math.random() * 1000,
  };

  return retry(fn, jitteredOptions);
}

