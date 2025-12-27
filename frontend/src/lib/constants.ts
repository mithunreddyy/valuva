/**
 * Application-wide constants
 * Centralized configuration values used throughout the application
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  CART: "cart",
  WISHLIST: "wishlist",
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  PRODUCT: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  WISHLIST: "/wishlist",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ORDERS: "/dashboard/orders",
  ADDRESSES: "/dashboard/addresses",
  PROFILE: "/dashboard",
  SEARCH: "/search",
  ABOUT: "/about",
} as const;

/**
 * Product sorting options
 */
export const SORT_OPTIONS = {
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  NEWEST: "newest",
  POPULAR: "popular",
} as const;

/**
 * Order status labels
 */
export const ORDER_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
} as const;

/**
 * Payment method labels
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  UPI: "UPI",
  NET_BANKING: "Net Banking",
  WALLET: "Wallet",
  COD: "Cash on Delivery",
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters`,
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: "Logged in successfully",
  REGISTER: "Account created successfully",
  LOGOUT: "Logged out successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  ADDRESS_ADDED: "Address added successfully",
  ADDRESS_UPDATED: "Address updated successfully",
  ADDRESS_DELETED: "Address deleted successfully",
  CART_ITEM_ADDED: "Item added to cart",
  CART_ITEM_UPDATED: "Cart updated",
  CART_ITEM_REMOVED: "Item removed from cart",
  WISHLIST_ADDED: "Added to wishlist",
  WISHLIST_REMOVED: "Removed from wishlist",
  ORDER_PLACED: "Order placed successfully",
  REVIEW_SUBMITTED: "Review submitted successfully",
} as const;
