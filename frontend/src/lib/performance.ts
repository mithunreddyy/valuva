/**
 * Performance optimization utilities
 */

/**
 * Lazy load images with intersection observer
 */
export function useLazyImage() {
  if (typeof window === "undefined") return;

  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Prefetch resources for faster navigation
 */
export function prefetchResource(href: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Optimize images - convert to WebP if supported
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality: number = 80
): string {
  if (!url) return url;

  // If using Next.js Image Optimization API
  if (
    url.startsWith("/") ||
    url.includes(process.env.NEXT_PUBLIC_APP_URL || "")
  ) {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    params.set("q", quality.toString());
    return `${url}?${params.toString()}`;
  }

  return url;
}

/**
 * Measure performance metrics
 */
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === "undefined" || !window.performance) {
    fn();
    return;
  }

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  performance.mark(startMark);
  fn();
  performance.mark(endMark);

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
  } catch (error) {
    console.error(`Performance measurement failed: ${error}`);
  }
}
