"use client";

import { Button } from "@/components/ui/button";
import {
  getCookiePreferences,
  getDefaultCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookies";
import { Info, Settings, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-2">
              Cookie Policy
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-luxury py-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#e5e5e5] rounded-[16px] p-5 sm:p-6 space-y-6">
            {/* Introduction */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Info className="h-5 w-5" />
                What Are Cookies?
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                Cookies are small text files that are placed on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our site.
              </p>
            </div>

            {/* Types of Cookies */}
            <div className="space-y-3">
              <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-2.5">
                <Settings className="h-5 w-5" />
                Types of Cookies We Use
              </h2>

              <div className="space-y-4">
                <div className="bg-[#fafafa] rounded-[12px] p-4 border border-[#e5e5e5]">
                  <h3 className="text-base font-medium text-[#0a0a0a] mb-2">
                    Essential Cookies
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                    These cookies are necessary for the website to function
                    properly. They enable core functionality such as security,
                    network management, and accessibility.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 font-medium">
                    <li>Authentication and session management</li>
                    <li>Shopping cart functionality</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing</li>
                  </ul>
                  <p className="text-xs text-neutral-500 font-medium mt-3">
                    These cookies cannot be disabled as they are essential for
                    website operation.
                  </p>
                </div>

                <div className="bg-[#fafafa] rounded-[12px] p-4 border border-[#e5e5e5]">
                  <h3 className="text-base font-medium text-[#0a0a0a] mb-2">
                    Performance Cookies
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                    These cookies help us understand how visitors interact with
                    our website by collecting and reporting information
                    anonymously.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 font-medium">
                    <li>Page views and navigation patterns</li>
                    <li>Time spent on pages</li>
                    <li>Error messages and performance issues</li>
                    <li>Traffic sources</li>
                  </ul>
                </div>

                <div className="bg-[#fafafa] rounded-[12px] p-4 border border-[#e5e5e5]">
                  <h3 className="text-base font-medium text-[#0a0a0a] mb-2">
                    Functionality Cookies
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                    These cookies allow the website to remember choices you make
                    and provide enhanced, personalized features.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 font-medium">
                    <li>Language preferences</li>
                    <li>Region and location settings</li>
                    <li>User preferences and settings</li>
                    <li>Recently viewed products</li>
                  </ul>
                </div>

                <div className="bg-[#fafafa] rounded-[12px] p-4 border border-[#e5e5e5]">
                  <h3 className="text-base font-medium text-[#0a0a0a] mb-2">
                    Targeting/Advertising Cookies
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                    These cookies are used to deliver advertisements relevant to
                    you and your interests. They also limit the number of times
                    you see an advertisement.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 font-medium">
                    <li>Personalized advertisements</li>
                    <li>Social media integration</li>
                    <li>Marketing campaign tracking</li>
                    <li>Cross-site tracking (with consent)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Third-Party Cookies
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                We may use third-party services that set cookies on your device.
                These include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 font-medium">
                <li>
                  <strong>Analytics Services:</strong> Google Analytics, to
                  understand website usage
                </li>
                <li>
                  <strong>Payment Processors:</strong> Secure payment gateway
                  cookies for transaction processing
                </li>
                <li>
                  <strong>Social Media:</strong> Facebook, Instagram, Twitter
                  for social sharing features
                </li>
                <li>
                  <strong>Advertising Networks:</strong> For personalized
                  advertising (with your consent)
                </li>
              </ul>
            </div>

            {/* Cookie Management */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Managing Cookies
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                You can control and manage cookies in several ways:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Browser Settings
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-2">
                    Most browsers allow you to refuse or accept cookies. You can
                    also delete cookies that have already been set. However,
                    blocking essential cookies may affect website functionality.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 font-medium">
                    <li>Chrome: Settings → Privacy and Security → Cookies</li>
                    <li>Firefox: Options → Privacy & Security → Cookies</li>
                    <li>Safari: Preferences → Privacy → Cookies</li>
                    <li>Edge: Settings → Privacy → Cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Cookie Consent Banner
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    When you first visit our website, you&apos;ll see a cookie
                    consent banner. You can accept all cookies, reject
                    non-essential cookies, or customize your preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Opt-Out Tools
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    You can opt out of certain third-party cookies through:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 font-medium">
                    <li>
                      Google Analytics Opt-out:{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0a0a0a] underline"
                      >
                        tools.google.com/dlpage/gaoptout
                      </a>
                    </li>
                    <li>
                      Network Advertising Initiative:{" "}
                      <a
                        href="https://www.networkadvertising.org/choices/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0a0a0a] underline"
                      >
                        networkadvertising.org/choices
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cookie Duration */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Cookie Duration
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Session Cookies
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Temporary cookies that are deleted when you close your
                    browser. Used for session management and shopping cart
                    functionality.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">
                    Persistent Cookies
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Cookies that remain on your device for a set period
                    (typically 30 days to 2 years) or until you delete them.
                    Used for preferences, authentication, and analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="space-y-4">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Updates to This Policy
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                We may update this Cookie Policy from time to time. We will
                notify you of any material changes by posting the updated policy
                on this page and updating the &quot;Last updated&quot; date.
              </p>
            </div>

            {/* Manage Your Cookies */}
            <div className="space-y-4 pt-8 border-t border-[#e5e5e5]">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a] flex items-center gap-3">
                <Settings className="h-6 w-6" />
                Manage Your Cookie Preferences
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-4">
                You can update your cookie preferences at any time. Click the
                button below to open the cookie settings panel.
              </p>
              <CookiePreferencesButton />
            </div>

            {/* Contact */}
            <div className="space-y-4 pt-8 border-t border-[#e5e5e5]">
              <h2 className="text-2xl font-medium tracking-normal text-[#0a0a0a]">
                Questions About Cookies?
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                If you have questions about our use of cookies, please contact
                us at{" "}
                <a
                  href="mailto:privacy@valuva.in"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  privacy@valuva.in
                </a>{" "}
                or refer to our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#0a0a0a] underline font-medium"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Cookie Preferences Button Component
function CookiePreferencesButton() {
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(() => {
    const existing = getCookiePreferences();
    return existing || getDefaultCookiePreferences();
  });

  const updatePreference = (
    category: keyof CookiePreferences,
    value: boolean
  ) => {
    if (category === "essential") return;
    setPreferences((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = () => {
    saveCookiePreferences({ ...preferences, consentGiven: true });
    setShowSettings(false);
    window.location.reload(); // Reload to apply changes
  };

  return (
    <>
      <Button
        onClick={() => setShowSettings(true)}
        size="lg"
        variant="outline"
        className="rounded-[12px] border-[#e5e5e5] hover:border-[#0a0a0a]"
      >
        <Settings className="h-4 w-4 mr-2" />
        Manage Cookie Preferences
      </Button>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white border border-[#e5e5e5] rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-6 rounded-t-[20px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#0a0a0a] flex items-center justify-center">
                  <Settings className="h-5 w-5 text-[#fafafa]" />
                </div>
                <h2 className="text-xl font-medium tracking-normal text-[#0a0a0a]">
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full hover:bg-[#fafafa] flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                Manage your cookie preferences. Essential cookies are required
                for the website to function and cannot be disabled.
              </p>

              {/* Cookie Categories */}
              {[
                {
                  key: "essential" as const,
                  title: "Essential Cookies",
                  description:
                    "Required for the website to function properly. These cannot be disabled.",
                  details:
                    "Authentication, session management, security, shopping cart",
                  disabled: true,
                },
                {
                  key: "performance" as const,
                  title: "Performance Cookies",
                  description:
                    "Help us understand how visitors interact with our website.",
                  details:
                    "Analytics, page views, navigation patterns, performance monitoring",
                  disabled: false,
                },
                {
                  key: "functionality" as const,
                  title: "Functionality Cookies",
                  description:
                    "Remember your preferences and provide enhanced features.",
                  details:
                    "Language preferences, region settings, recently viewed products",
                  disabled: false,
                },
                {
                  key: "targeting" as const,
                  title: "Targeting/Advertising Cookies",
                  description:
                    "Used to deliver relevant advertisements and track campaign effectiveness.",
                  details:
                    "Personalized ads, social media integration, marketing campaigns",
                  disabled: false,
                },
              ].map((category) => (
                <div
                  key={category.key}
                  className="border border-[#e5e5e5] rounded-[16px] p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-[#0a0a0a] mb-1">
                        {category.title}
                      </h3>
                      <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updatePreference(
                          category.key,
                          !preferences[category.key]
                        )
                      }
                      disabled={category.disabled}
                      className={`flex-shrink-0 ml-4 w-12 h-6 rounded-full transition-colors ${
                        preferences[category.key]
                          ? "bg-[#0a0a0a]"
                          : "bg-neutral-300"
                      } flex items-center ${
                        preferences[category.key]
                          ? "justify-end"
                          : "justify-start"
                      } px-1 ${
                        category.disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#fafafa]"></div>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">
                    {category.details}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t border-[#e5e5e5]">
                <p className="text-xs text-neutral-500 font-medium mb-4 text-center">
                  For more information, please read our{" "}
                  <Link
                    href="/cookie-policy"
                    className="text-[#0a0a0a] underline hover:no-underline"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    onClick={handleSave}
                    size="lg"
                    variant="filled"
                    className="rounded-[12px] flex-1"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    size="lg"
                    variant="outline"
                    className="rounded-[12px] flex-1 border-[#e5e5e5] hover:border-[#0a0a0a]"
                  >
                    Cancel
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
