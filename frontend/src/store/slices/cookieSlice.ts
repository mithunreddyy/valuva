import { getStorageItem, setStorageItem } from "@/lib/storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Cookie slice state interface
 * Manages cookie consent preferences
 */
interface CookieState {
  consentGiven: boolean;
  necessaryCookies: boolean;
  analyticsCookies: boolean;
  marketingCookies: boolean;
  preferencesCookies: boolean;
}

const getInitialState = (): CookieState => {
  const consentGiven = getStorageItem("cookieConsent") === "true";
  const preferences = getStorageItem("cookiePreferences");
  
  if (preferences) {
    try {
      const parsed = JSON.parse(preferences);
      return {
        consentGiven,
        necessaryCookies: parsed.necessary ?? true,
        analyticsCookies: parsed.analytics ?? false,
        marketingCookies: parsed.marketing ?? false,
        preferencesCookies: parsed.preferences ?? false,
      };
    } catch {
      // Fallback if parsing fails
    }
  }

  return {
    consentGiven,
    necessaryCookies: true,
    analyticsCookies: false,
    marketingCookies: false,
    preferencesCookies: false,
  };
};

const initialState: CookieState = getInitialState();

const cookieSlice = createSlice({
  name: "cookie",
  initialState,
  reducers: {
    setConsent: (state, action: PayloadAction<boolean>) => {
      state.consentGiven = action.payload;
      setStorageItem("cookieConsent", action.payload.toString());
    },
    setCookiePreferences: (
      state,
      action: PayloadAction<{
        necessary?: boolean;
        analytics?: boolean;
        marketing?: boolean;
        preferences?: boolean;
      }>
    ) => {
      if (action.payload.necessary !== undefined) {
        state.necessaryCookies = action.payload.necessary;
      }
      if (action.payload.analytics !== undefined) {
        state.analyticsCookies = action.payload.analytics;
      }
      if (action.payload.marketing !== undefined) {
        state.marketingCookies = action.payload.marketing;
      }
      if (action.payload.preferences !== undefined) {
        state.preferencesCookies = action.payload.preferences;
      }

      // Save preferences to storage
      const preferences = {
        necessary: state.necessaryCookies,
        analytics: state.analyticsCookies,
        marketing: state.marketingCookies,
        preferences: state.preferencesCookies,
      };
      setStorageItem("cookiePreferences", JSON.stringify(preferences));
    },
    acceptAllCookies: (state) => {
      state.consentGiven = true;
      state.necessaryCookies = true;
      state.analyticsCookies = true;
      state.marketingCookies = true;
      state.preferencesCookies = true;

      setStorageItem("cookieConsent", "true");
      const preferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      };
      setStorageItem("cookiePreferences", JSON.stringify(preferences));
    },
    rejectAllCookies: (state) => {
      state.consentGiven = true;
      state.necessaryCookies = true;
      state.analyticsCookies = false;
      state.marketingCookies = false;
      state.preferencesCookies = false;

      setStorageItem("cookieConsent", "true");
      const preferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      };
      setStorageItem("cookiePreferences", JSON.stringify(preferences));
    },
    resetCookiePreferences: (state) => {
      state.consentGiven = false;
      state.necessaryCookies = true;
      state.analyticsCookies = false;
      state.marketingCookies = false;
      state.preferencesCookies = false;
    },
  },
});

export const {
  setConsent,
  setCookiePreferences,
  acceptAllCookies,
  rejectAllCookies,
  resetCookiePreferences,
} = cookieSlice.actions;
export default cookieSlice.reducer;

