import { ORDER_STATUS, PAYMENT_METHODS } from "./constants";

/**
 * Formatter utility functions
 * Provides consistent formatting for dates, prices, and other data types
 */

/**
 * Format price in Indian Rupees
 * @param price - Price value to format
 * @param showDecimals - Whether to show decimal places (default: false)
 * @returns Formatted price string (e.g., "₹1,234" or "₹1,234.56")
 */
export function formatPrice(price: number, showDecimals: boolean = false): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price);
}

/**
 * Format date in readable format
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    ...options,
  }).format(dateObj);
}

/**
 * Format date and time
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

/**
 * Format order status for display
 * @param status - Order status key
 * @returns Human-readable status label
 */
export function formatOrderStatus(status: string): string {
  return (
    ORDER_STATUS[status as keyof typeof ORDER_STATUS] || status || "Unknown"
  );
}

/**
 * Format payment method for display
 * @param method - Payment method key
 * @returns Human-readable payment method label
 */
export function formatPaymentMethod(method: string): string {
  return (
    PAYMENT_METHODS[method as keyof typeof PAYMENT_METHODS] || method || "Unknown"
  );
}

/**
 * Format phone number (Indian format)
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "+91 98765 43210")
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Format as +91 XXXXX XXXXX
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format percentage
 * @param value - Value to format as percentage
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "25%")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

