"use client";

import { useState, useCallback } from "react";
import { z } from "zod";
import {
  validateField,
  validateForm,
  ValidationResult,
} from "@/lib/form-validation.util";

/**
 * React hook for real-time form validation
 */
export function useFormValidation<T extends z.ZodTypeAny>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Validate a single field
   */
  const validateFieldValue = useCallback(
    (fieldName: string, value: unknown) => {
      const error = validateField(schema, fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error || "",
      }));
      return !error;
    },
    [schema]
  );

  /**
   * Mark field as touched
   */
  const setFieldTouched = useCallback((fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  /**
   * Validate entire form
   */
  const validate = useCallback(
    (data: unknown): ValidationResult => {
      const result = validateForm(schema, data);
      setErrors(result.errors);
      return result;
    },
    [schema]
  );

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Get error for field (only if touched)
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return touched[fieldName] ? errors[fieldName] : undefined;
    },
    [errors, touched]
  );

  return {
    errors,
    touched,
    validateField: validateFieldValue,
    setFieldTouched,
    validate,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}

