/**
 * Web Vitals Integration
 * Reports Core Web Vitals to analytics
 */

import { reportWebVitals } from "./performance.util";

export function onWebVitals(metric: {
  name: string;
  value: number;
  id: string;
  delta?: number;
  rating?: "good" | "needs-improvement" | "poor";
}) {
  reportWebVitals(metric);
}
