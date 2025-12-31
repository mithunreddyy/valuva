/**
 * Storage Utility
 * Production-ready storage helper with SSR safety
 * Handles localStorage and sessionStorage access safely in Next.js
 */

/**
 * Safely get item from localStorage
 * @param key - Storage key
 * @returns Stored value or null if not found or error
 */
export function getStorageItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Failed to get ${key} from localStorage:`, error);
    }
    return null;
  }
}

/**
 * Safely set item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export function setStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to set ${key} in localStorage:`, error);
  }
}

/**
 * Safely remove item from localStorage
 * @param key - Storage key to remove
 */
export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
    }
  }
}

/**
 * Safely get item from sessionStorage
 * @param key - Storage key
 * @returns Stored value or null if not found or error
 */
export function getSessionItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get ${key} from sessionStorage:`, error);
    return null;
  }
}

/**
 * Safely set item in sessionStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export function setSessionItem(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to set ${key} in sessionStorage:`, error);
  }
}

/**
 * Safely remove item from sessionStorage
 * @param key - Storage key to remove
 */
export function removeSessionItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from sessionStorage:`, error);
  }
}
