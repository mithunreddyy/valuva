/**
 * Performance Monitoring Utility
 * Tracks Web Vitals and performance metrics
 * Production-ready performance monitoring
 */

/**
 * Web Vitals metric interface
 */
export interface WebVitals {
  name: string;
  value: number;
  id: string;
  delta?: number;
  rating?: "good" | "needs-improvement" | "poor";
}

/**
 * Report Web Vitals to analytics
 * @param metric - Web Vitals metric to report
 */
export function reportWebVitals(metric: WebVitals): void {
  // Send to backend analytics
  if (typeof window !== "undefined") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Use sendBeacon for reliable delivery (doesn't block page unload)
    const data = JSON.stringify({
      eventType: "WEB_VITALS",
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      rating: metric.rating,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Try sendBeacon first (more reliable)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${apiUrl}/api/v1/analytics/track`, data);
    } else {
      // Fallback to fetch
      fetch(`${apiUrl}/api/v1/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true, // Keep request alive after page unload
      }).catch(() => {
        // Silently fail - performance monitoring shouldn't break the app
      });
    }
  }
}

/**
 * Measure custom performance metric
 * @param name - Metric name
 * @param fn - Function to measure
 * @returns Promise resolving to duration in milliseconds
 */
export function measurePerformance(
  name: string,
  fn: () => void | Promise<void>
): Promise<number> {
  return new Promise(async (resolve) => {
    const start = performance.now();

    try {
      await fn();
    } finally {
      const duration = performance.now() - start;

      // Report to analytics
      if (typeof window !== "undefined") {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const data = JSON.stringify({
          eventType: "PERFORMANCE",
          name,
          value: duration,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(`${apiUrl}/api/v1/analytics/track`, data);
        }
      }

      resolve(duration);
    }
  });
}

/**
 * Track page load performance
 * Automatically tracks navigation timing metrics
 */
export function trackPageLoad(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("load", () => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ssl: navigation.secureConnectionStart
          ? navigation.connectEnd - navigation.secureConnectionStart
          : 0,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.domInteractive,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const data = JSON.stringify({
        eventType: "PAGE_LOAD",
        metrics,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${apiUrl}/api/v1/analytics/track`, data);
      }
    }
  });
}

/**
 * Initialize performance monitoring
 * Sets up page load tracking and long task monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === "undefined") return;

  // Track page load
  trackPageLoad();

  // Monitor long tasks (blocking operations)
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Log long tasks (>50ms)
            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "https://valuva.in";
            const data = JSON.stringify({
              eventType: "LONG_TASK",
              duration: entry.duration,
              startTime: entry.startTime,
              url: window.location.href,
              timestamp: new Date().toISOString(),
            });

            if (navigator.sendBeacon) {
              navigator.sendBeacon(`${apiUrl}/api/v1/analytics/track`, data);
            }
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      console.error(`PerformanceObserver not supported: ${e}`);
    }
  }
}
