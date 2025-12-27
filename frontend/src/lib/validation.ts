import { ERROR_MESSAGES, VALIDATION } from "./constants";

/**
 * Validation utility functions
 * Provides reusable validation logic for forms and user input
 */

/**
 * Email validation
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Phone number validation (Indian format)
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Password validation
 * @param password - Password to validate
 * @returns Object with isValid flag and error message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
    };
  }
  return { isValid: true };
}

/**
 * Name validation
 * @param name - Name to validate
 * @returns Object with isValid flag and error message
 */
export function validateName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  if (name.length < VALIDATION.NAME_MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.NAME_TOO_SHORT };
  }
  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.NAME_TOO_LONG };
  }
  return { isValid: true };
}

/**
 * Required field validation
 * @param value - Value to check
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid flag and error message
 */
export function validateRequired(
  value: string | number | undefined | null,
  fieldName?: string
): { isValid: boolean; error?: string } {
  if (value === undefined || value === null || value === "") {
    return {
      isValid: false,
      error: fieldName ? `${fieldName} is required` : ERROR_MESSAGES.REQUIRED,
    };
  }
  return { isValid: true };
}

/**
 * URL validation
 * @param url - URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Number validation
 * @param value - Value to validate
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @returns Object with isValid flag and error message
 */
export function validateNumber(
  value: number | string,
  min?: number,
  max?: number
): { isValid: boolean; error?: string } {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: "Must be a valid number" };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be at most ${max}` };
  }

  return { isValid: true };
}

/**
 * Form validation helper
 * Validates multiple fields at once
 * @param fields - Object with field names and values
 * @param validators - Object with field names and validator functions
 * @returns Object with isValid flag and errors object
 */
export function validateForm<T extends Record<string, unknown>>(
  fields: T,
  validators: {
    [K in keyof T]?: (value: T[K]) => { isValid: boolean; error?: string };
  }
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const field in validators) {
    const validator = validators[field];
    if (validator) {
      const result = validator(fields[field]);
      if (!result.isValid) {
        isValid = false;
        if (result.error) {
          errors[field] = result.error;
        }
      }
    }
  }

  return { isValid, errors };
}
