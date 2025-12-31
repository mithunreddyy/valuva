/**
 * Debounce and Throttle Utilities
 * Production-ready utilities for rate limiting user interactions
 * Prevents excessive API calls and improves performance
 */

/**
 * Debounce function - delays execution until after wait time
 * Useful for search inputs, resize handlers, etc.
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @param immediate - If true, execute immediately on first call
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func(...args);
    }
  };
}

/**
 * Throttle function - limits execution to once per wait time
 * Useful for scroll handlers, mouse move, etc.
 * @param func - Function to throttle
 * @param wait - Wait time in milliseconds
 * @param options - Throttle options (leading, trailing)
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options;
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (!previous && !leading) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * Debounce hook for React (returns debounced function)
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T {
  if (typeof window === "undefined") {
    return func;
  }

  return debounce(func, wait) as T;
}

/**
 * Throttle hook for React (returns throttled function)
 * @param func - Function to throttle
 * @param wait - Wait time in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T {
  if (typeof window === "undefined") {
    return func;
  }

  return throttle(func, wait) as T;
}
