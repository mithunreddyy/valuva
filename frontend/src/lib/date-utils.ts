/**
 * Date utility functions
 * Provides helpers for date formatting, parsing, and manipulation
 */

import { format, formatDistance, formatDistanceToNow, isValid, parseISO } from "date-fns";

/**
 * Format date to readable string
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatStr: string = "MMM dd, yyyy"
): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatStr);
  } catch {
    return "";
  }
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: Date | string | null | undefined,
  formatStr: string = "MMM dd, yyyy 'at' h:mm a"
): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatStr);
  } catch {
    return "";
  }
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Get time distance between two dates
 */
export function getTimeDistance(
  from: Date | string,
  to: Date | string
): string {
  try {
    const fromObj = typeof from === "string" ? parseISO(from) : from;
    const toObj = typeof to === "string" ? parseISO(to) : to;
    
    if (!isValid(fromObj) || !isValid(toObj)) return "";
    
    return formatDistance(fromObj, toObj, { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return dateObj < new Date();
  } catch {
    return false;
  }
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return dateObj > new Date();
  } catch {
    return false;
  }
}

/**
 * Get date range for analytics (last N days)
 */
export function getDateRange(days: number = 30): {
  startDate: Date;
  endDate: Date;
} {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return { startDate, endDate };
}

/**
 * Format date range for API
 */
export function formatDateRange(startDate: Date, endDate: Date): {
  startDate: string;
  endDate: string;
} {
  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

