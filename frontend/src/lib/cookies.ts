/**
 * Cookie Management Utility
 * Handles cookie consent and preferences storage
 * Compliant with Indian data protection regulations
 */

export type CookieCategory =
  | "essential"
  | "performance"
  | "functionality"
  | "targeting";

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  performance: boolean;
  functionality: boolean;
  targeting: boolean;
  consentGiven: boolean;
  consentDate?: string;
}

const COOKIE_PREFERENCES_KEY = "valuva_cookie_preferences";
const COOKIE_CONSENT_KEY = "valuva_cookie_consent";

/**
 * Get cookie preferences from localStorage
 * @returns Cookie preferences or null if not found
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!stored) return null;

    const preferences = JSON.parse(stored) as CookiePreferences;
    return preferences;
  } catch {
    return null;
  }
}

/**
 * Save cookie preferences to localStorage
 * @param preferences - Cookie preferences to save
 */
export function saveCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;

  try {
    preferences.consentDate = new Date().toISOString();
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");

    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("cookiePreferencesUpdated", { detail: preferences })
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to save cookie preferences:", error);
    }
  }
}

/**
 * Check if user has given consent
 * @returns true if consent has been given, false otherwise
 */
export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
}

/**
 * Get default cookie preferences (all false except essential)
 * @returns Default cookie preferences object
 */
export function getDefaultCookiePreferences(): CookiePreferences {
  return {
    essential: true, // Always enabled
    performance: false,
    functionality: false,
    targeting: false,
    consentGiven: false,
  };
}

/**
 * Accept all cookies
 * @returns Updated cookie preferences with all categories enabled
 */
export function acceptAllCookies(): CookiePreferences {
  const preferences: CookiePreferences = {
    essential: true,
    performance: true,
    functionality: true,
    targeting: true,
    consentGiven: true,
  };
  saveCookiePreferences(preferences);
  return preferences;
}

/**
 * Reject non-essential cookies
 * @returns Updated cookie preferences with only essential cookies enabled
 */
export function rejectNonEssentialCookies(): CookiePreferences {
  const preferences: CookiePreferences = {
    essential: true,
    performance: false,
    functionality: false,
    targeting: false,
    consentGiven: true,
  };
  saveCookiePreferences(preferences);
  return preferences;
}

/**
 * Check if a specific cookie category is enabled
 * @param category - Cookie category to check
 * @returns true if category is enabled, false otherwise
 */
export function isCookieCategoryEnabled(category: CookieCategory): boolean {
  const preferences = getCookiePreferences();
  if (!preferences) return category === "essential"; // Only essential by default

  return preferences[category] ?? false;
}

/**
 * Clear all cookie preferences (for testing/debugging)
 * Removes all stored cookie preferences and consent
 */
export function clearCookiePreferences(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COOKIE_PREFERENCES_KEY);
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent("cookiePreferencesUpdated"));
}

/**
 * Initialize analytics and tracking based on preferences
 * Should be called after cookie preferences are loaded
 */
export function initializeTrackingBasedOnPreferences(): void {
  if (typeof window === "undefined") return;

  const preferences = getCookiePreferences();
  if (!preferences) return;

  // Initialize analytics if performance cookies are enabled
  if (preferences.performance) {
    // Initialize Google Analytics or other analytics tools here
    // Example: gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  // Initialize advertising/targeting if targeting cookies are enabled
  if (preferences.targeting) {
    // Initialize advertising pixels here
    // Example: gtag('consent', 'update', { ad_storage: 'granted' });
  }
}
