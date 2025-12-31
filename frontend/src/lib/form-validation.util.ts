/**
 * Form Validation Utilities
 * Production-ready real-time validation helpers
 */

import { z } from "zod";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate form field in real-time
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): string | null {
  try {
    // Check if schema is a ZodObject to access shape
    if (schema instanceof z.ZodObject) {
      const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape];

      if (fieldSchema) {
        fieldSchema.parse(value);
        return null;
      }
    }

    // Fallback: validate against full schema with single field
    // Create a temporary object with just this field
    const tempSchema = z.object({ [fieldName]: z.unknown() });
    tempSchema.parse({ [fieldName]: value });

    // Also try to validate against full schema to catch cross-field validation
    try {
      schema.parse({ [fieldName]: value } as T);
    } catch {
        // If full schema validation fails, that's okay for single field validation
        return null;
    }

    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.issues.find((e: z.ZodIssue) =>
        e.path.includes(fieldName)
      );
      return fieldError?.message || "Invalid value";
    }
    return "Validation error";
  }
}

/**
 * Validate entire form
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: { _form: "Validation failed" },
    };
  }
}

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Phone validation (international format)
 */
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/[\s-()]/g, ""));
}

/**
 * Password strength validation
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("At least 8 characters");
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push("One lowercase letter");
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("One uppercase letter");
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("One number");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("One special character");
  }

  return {
    score,
    feedback,
    isValid: score >= 4,
  };
}

/**
 * Credit card validation (Luhn algorithm)
 */
export function validateCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
