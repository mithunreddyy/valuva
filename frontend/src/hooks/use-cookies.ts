"use client";

import {
  getCookiePreferences,
  hasCookieConsent,
  isCookieCategoryEnabled,
  type CookieCategory,
  type CookiePreferences,
} from "@/lib/cookies";
import { useEffect, useState } from "react";

/**
 * Hook to manage and access cookie preferences
 */
export function useCookies() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(
    null
  );
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const loadPreferences = () => {
      const prefs = getCookiePreferences();
      setPreferences(prefs);
      setHasConsent(hasCookieConsent());
    };

    loadPreferences();

    // Listen for preference updates
    const handleUpdate = () => {
      loadPreferences();
    };

    window.addEventListener("cookiePreferencesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cookiePreferencesUpdated", handleUpdate);
    };
  }, []);

  const isEnabled = (category: CookieCategory): boolean => {
    return isCookieCategoryEnabled(category);
  };

  return {
    preferences,
    hasConsent,
    isEnabled,
  };
}
