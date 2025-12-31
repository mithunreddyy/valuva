"use client";

import { useEffect } from "react";
import { initPerformanceMonitoring } from "@/lib/performance.util";

/**
 * Client-side initialization component
 * Handles performance monitoring, analytics, etc.
 */
export function ClientInit() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
  }, []);

  return null;
}

