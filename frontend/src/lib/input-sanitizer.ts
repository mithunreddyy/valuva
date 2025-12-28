/**
 * Input Sanitization Utility
 * Production-ready input cleaning and validation for frontend
 * Prevents XSS and ensures data integrity
 */

export class InputSanitizer {
  /**
   * Sanitize string input
   */
  static sanitizeString(
    input: string,
    options?: {
      maxLength?: number;
      allowHtml?: boolean;
      trim?: boolean;
    }
  ): string {
    if (typeof input !== "string") {
      return "";
    }

    let sanitized = input;

    // Trim whitespace
    if (options?.trim !== false) {
      sanitized = sanitized.trim();
    }

    // Remove HTML tags if not allowed
    if (!options?.allowHtml) {
      // Create a temporary div to strip HTML
      if (typeof document !== "undefined") {
        const div = document.createElement("div");
        div.textContent = sanitized;
        sanitized = div.textContent || "";
      } else {
        // Server-side: basic regex removal
        sanitized = sanitized.replace(/<[^>]*>/g, "");
      }
    }

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, "");

    // Limit length
    if (options?.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    return sanitized;
  }

  /**
   * Sanitize email address
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== "string") {
      return "";
    }

    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, "")
      .substring(0, 254); // Max email length
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    if (typeof phone !== "string") {
      return "";
    }

    // Remove all non-digit characters
    return phone.replace(/\D/g, "").substring(0, 15);
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    if (typeof url !== "string") {
      return "";
    }

    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "";
      }
      return parsed.toString();
    } catch {
      return "";
    }
  }

  /**
   * Sanitize search query
   */
  static sanitizeSearchQuery(query: string): string {
    if (typeof query !== "string") {
      return "";
    }

    return this.sanitizeString(query, {
      maxLength: 200,
      allowHtml: false,
      trim: true,
    });
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 128) {
      errors.push("Password must be less than 128 characters");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    // Check for common weak passwords
    const commonPasswords = [
      "password",
      "12345678",
      "qwerty",
      "abc123",
      "password123",
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject<T extends Record<string, unknown>>(
    obj: T,
    options?: {
      maxDepth?: number;
      allowHtml?: boolean;
    }
  ): T {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      return obj;
    }

    const maxDepth = options?.maxDepth || 10;
    const sanitized = {} as T;

    for (const [key, value] of Object.entries(obj)) {
      // Sanitize key
      const sanitizedKey = this.sanitizeString(key, { maxLength: 100 });

      if (typeof value === "string") {
        (sanitized as unknown as Record<string, unknown>)[sanitizedKey] =
          this.sanitizeString(value, {
            allowHtml: options?.allowHtml,
          });
      } else if (Array.isArray(value)) {
        (sanitized as unknown as Record<string, unknown>)[sanitizedKey] =
          value.map((item) =>
            typeof item === "string"
              ? this.sanitizeString(item, { allowHtml: options?.allowHtml })
              : maxDepth > 0
              ? this.sanitizeObject(item, {
                  ...options,
                  maxDepth: maxDepth - 1,
                })
              : item
          );
      } else if (value && typeof value === "object" && maxDepth > 0) {
        (sanitized as unknown as Record<string, unknown>)[sanitizedKey] =
          this.sanitizeObject(value as Record<string, unknown>, {
            ...options,
            maxDepth: maxDepth - 1,
          });
      } else {
        (sanitized as unknown as Record<string, unknown>)[sanitizedKey] = value;
      }
    }

    return sanitized;
  }
}
