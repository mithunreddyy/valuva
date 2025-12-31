/**
 * API Retry Utility
 * Production-ready retry logic with exponential backoff
 * Handles transient failures gracefully
 */

/**
 * Retry options configuration
 */
export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatuses?: number[];
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ["ECONNABORTED", "ETIMEDOUT", "ENOTFOUND", "ECONNRESET"],
};

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns Result of the function call
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | unknown;
  let currentDelay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryableError(error, opts)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxAttempts) {
        throw error;
      }

      // Calculate delay with jitter (random variation to prevent thundering herd)
      const jitter = Math.random() * 0.3 * currentDelay; // 0-30% jitter
      const delay = Math.min(currentDelay + jitter, opts.maxDelay);

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Exponential backoff
      currentDelay *= opts.backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Check if error is retryable
 * @param error - Error to check
 * @param options - Retry options
 * @returns true if error is retryable, false otherwise
 */
function isRetryableError(
  error: unknown,
  options: Required<RetryOptions>
): boolean {
  // Check for axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status) {
      return options.retryableStatuses.includes(axiosError.response.status);
    }
  }

  // Check for network errors
  if (error && typeof error === "object" && "code" in error) {
    const networkError = error as { code?: string; message?: string };
    if (networkError.code) {
      return options.retryableErrors.includes(networkError.code);
    }
    if (networkError.message) {
      return options.retryableErrors.some((err) =>
        networkError.message?.includes(err)
      );
    }
  }

  // Check for timeout errors
  if (error instanceof Error) {
    if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      return true;
    }
  }

  return false;
}

/**
 * Create a retryable API call wrapper
 * @param apiCall - API call function
 * @param options - Retry options
 * @returns Wrapped function that retries on failure
 */
export function createRetryableApiCall<T>(
  apiCall: () => Promise<T>,
  options?: RetryOptions
) {
  return () => retryWithBackoff(apiCall, options);
}

