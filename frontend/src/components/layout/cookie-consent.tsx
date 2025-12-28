"use client";

import { Button } from "@/components/ui/button";
import {
  acceptAllCookies,
  getCookiePreferences,
  getDefaultCookiePreferences,
  rejectNonEssentialCookies,
  saveCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookies";
import { Cookie, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    getDefaultCookiePreferences()
  );

  useEffect(() => {
    // Check if user has already given consent
    const existingPreferences = getCookiePreferences();
    if (!existingPreferences || !existingPreferences.consentGiven) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load existing preferences
      setTimeout(() => {
        setPreferences(existingPreferences);
      }, 0);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = acceptAllCookies();
    setPreferences(newPreferences);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const newPreferences = rejectNonEssentialCookies();
    setPreferences(newPreferences);
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSavePreferences = () => {
    const newPreferences: CookiePreferences = {
      ...preferences,
      consentGiven: true,
    };
    saveCookiePreferences(newPreferences);
    setPreferences(newPreferences);
    setShowSettings(false);
    setShowBanner(false);
  };

  const updatePreference = (
    category: keyof CookiePreferences,
    value: boolean
  ) => {
    if (category === "essential") return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({ ...prev, [category]: value }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-[16px] p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-4 w-4 text-[#fafafa]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                    We use cookies to enhance your experience.{" "}
                    <Link
                      href="/cookie-policy"
                      className="text-[#0a0a0a] underline font-medium hover:no-underline"
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    onClick={handleRejectNonEssential}
                    size="sm"
                    variant="outline"
                    className="rounded-[10px] border-[#e5e5e5] hover:border-[#0a0a0a] text-xs h-8 px-3"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    variant="filled"
                    className="rounded-[10px] text-xs h-8 px-4"
                  >
                    Accept
                  </Button>
                  <button
                    onClick={handleCustomize}
                    className="w-8 h-8 rounded-[10px] border border-[#e5e5e5] hover:border-[#0a0a0a] flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Customize cookies"
                  >
                    <Settings className="h-3.5 w-3.5 text-neutral-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white border border-[#e5e5e5] rounded-[16px] w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-4 rounded-t-[16px] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#0a0a0a] flex items-center justify-center">
                  <Settings className="h-4 w-4 text-[#fafafa]" />
                </div>
                <h2 className="text-base font-medium tracking-normal text-[#0a0a0a]">
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowSettings(false);
                  if (!preferences.consentGiven) {
                    setShowBanner(true);
                  }
                }}
                className="w-7 h-7 rounded-full hover:bg-[#fafafa] flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                Manage your cookie preferences. Essential cookies are required
                for the website to function and cannot be disabled.
              </p>

              {/* Essential Cookies */}
              <div className="border border-[#e5e5e5] rounded-[12px] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#0a0a0a] mb-0.5">
                      Essential
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      Required • Cannot be disabled
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-10 h-5 rounded-full bg-[#0a0a0a] flex items-center justify-end px-0.5">
                      <div className="w-4 h-4 rounded-full bg-[#fafafa]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border border-[#e5e5e5] rounded-[12px] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#0a0a0a] mb-0.5">
                      Performance
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      Analytics & site usage
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updatePreference("performance", !preferences.performance)
                    }
                    className={`flex-shrink-0 ml-3 w-10 h-5 rounded-full transition-colors ${
                      preferences.performance
                        ? "bg-[#0a0a0a]"
                        : "bg-neutral-300"
                    } flex items-center ${
                      preferences.performance ? "justify-end" : "justify-start"
                    } px-0.5`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#fafafa]"></div>
                  </button>
                </div>
              </div>

              {/* Functionality Cookies */}
              <div className="border border-[#e5e5e5] rounded-[12px] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#0a0a0a] mb-0.5">
                      Functionality
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      Preferences & features
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updatePreference(
                        "functionality",
                        !preferences.functionality
                      )
                    }
                    className={`flex-shrink-0 ml-3 w-10 h-5 rounded-full transition-colors ${
                      preferences.functionality
                        ? "bg-[#0a0a0a]"
                        : "bg-neutral-300"
                    } flex items-center ${
                      preferences.functionality
                        ? "justify-end"
                        : "justify-start"
                    } px-0.5`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#fafafa]"></div>
                  </button>
                </div>
              </div>

              {/* Targeting Cookies */}
              <div className="border border-[#e5e5e5] rounded-[12px] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#0a0a0a] mb-0.5">
                      Advertising
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      Personalized ads
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updatePreference("targeting", !preferences.targeting)
                    }
                    className={`flex-shrink-0 ml-3 w-10 h-5 rounded-full transition-colors ${
                      preferences.targeting ? "bg-[#0a0a0a]" : "bg-neutral-300"
                    } flex items-center ${
                      preferences.targeting ? "justify-end" : "justify-start"
                    } px-0.5`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#fafafa]"></div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#e5e5e5]">
                <p className="text-xs text-neutral-500 font-medium mb-3 text-center">
                  <Link
                    href="/cookie-policy"
                    className="text-[#0a0a0a] underline hover:no-underline"
                  >
                    Learn more
                  </Link>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setShowSettings(false);
                      if (!preferences.consentGiven) {
                        setShowBanner(true);
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="rounded-[10px] flex-1 border-[#e5e5e5] hover:border-[#0a0a0a] text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePreferences}
                    size="sm"
                    variant="filled"
                    className="rounded-[10px] flex-1 text-xs h-8"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
