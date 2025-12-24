export const API_VERSION = "v1";
export const API_PREFIX = `/api/${API_VERSION}`;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const ORDER_NUMBER_PREFIX = "ORD";

export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;

export const INVENTORY_CHANGE_REASONS = {
  PURCHASE: "PURCHASE",
  SALE: "SALE",
  RETURN: "RETURN",
  ADJUSTMENT: "ADJUSTMENT",
  DAMAGE: "DAMAGE",
  RESTOCK: "RESTOCK",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  INVALID_CREDENTIALS: "Invalid credentials",
  EMAIL_EXISTS: "Email already exists",
  INVALID_TOKEN: "Invalid or expired token",
  INSUFFICIENT_STOCK: "Insufficient stock",
  INVALID_COUPON: "Invalid or expired coupon",
  CART_EMPTY: "Cart is empty",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful",
  REGISTER: "Registration successful",
  LOGOUT: "Logout successful",
  PASSWORD_RESET_REQUEST: "Password reset email sent",
  PASSWORD_RESET_SUCCESS: "Password reset successful",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
} as const;
