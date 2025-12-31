"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  getCookiePreferences,
  getDefaultCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookies";
import { motion } from "framer-motion";
import { Cookie, Info, Settings, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Cookie Policy", url: "/cookie-policy", isBold: true },
          ]}
        />
      </div>

      {/* Hero Header - Apple Style */}
      <section className="relative border-b border-[#f5f5f5] bg-gradient-to-b from-white via-white to-[#fafafa]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01),transparent_70%)]" />
        <div className="container-luxury py-10 sm:py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-4 shadow-lg"
            >
              <Cookie className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
            >
              Cookie Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs sm:text-sm text-neutral-400 font-normal"
            >
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container-luxury py-10 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Info className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                What Are Cookies?
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and understanding how
              you use our site.
            </p>
          </motion.div>

          {/* Types of Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Settings className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Types of Cookies We Use
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Essential Cookies",
                  desc: "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.",
                  items: [
                    "Authentication and session management",
                    "Shopping cart functionality",
                    "Security and fraud prevention",
                    "Load balancing",
                  ],
                  note: "These cookies cannot be disabled as they are essential for website operation.",
                },
                {
                  title: "Performance Cookies",
                  desc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
                  items: [
                    "Page views and navigation patterns",
                    "Time spent on pages",
                    "Error messages and performance issues",
                    "Traffic sources",
                  ],
                },
                {
                  title: "Functionality Cookies",
                  desc: "These cookies allow the website to remember choices you make and provide enhanced, personalized features.",
                  items: [
                    "Language preferences",
                    "Region and location settings",
                    "User preferences and settings",
                    "Recently viewed products",
                  ],
                },
                {
                  title: "Targeting/Advertising Cookies",
                  desc: "These cookies are used to deliver advertisements relevant to you and your interests. They also limit the number of times you see an advertisement.",
                  items: [
                    "Personalized advertisements",
                    "Social media integration",
                    "Marketing campaign tracking",
                    "Cross-site tracking (with consent)",
                  ],
                },
              ].map((cookieType, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]"
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                    {cookieType.title}
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                    {cookieType.desc}
                  </p>
                  <div className="space-y-2 mb-3">
                    {cookieType.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start gap-2.5 bg-white rounded-[12px] p-2.5 border border-[#e5e5e5]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-600 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  {cookieType.note && (
                    <p className="text-xs text-neutral-500 font-medium">
                      {cookieType.note}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Third-Party Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Third-Party Cookies
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-3">
              We may use third-party services that set cookies on your device.
              These include:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Analytics Services",
                  desc: "Google Analytics, to understand website usage",
                },
                {
                  title: "Payment Processors",
                  desc: "Secure payment gateway cookies for transaction processing",
                },
                {
                  title: "Social Media",
                  desc: "Facebook, Instagram, Twitter for social sharing features",
                },
                {
                  title: "Advertising Networks",
                  desc: "For personalized advertising (with your consent)",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[12px] p-4 border border-[#e5e5e5]"
                >
                  <h3 className="text-sm font-medium text-[#0a0a0a] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cookie Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Managing Cookies
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              You can control and manage cookies in several ways:
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Browser Settings",
                  desc: "Most browsers allow you to refuse or accept cookies. You can also delete cookies that have already been set. However, blocking essential cookies may affect website functionality.",
                  items: [
                    "Chrome: Settings → Privacy and Security → Cookies",
                    "Firefox: Options → Privacy & Security → Cookies",
                    "Safari: Preferences → Privacy → Cookies",
                    "Edge: Settings → Privacy → Cookies",
                  ],
                },
                {
                  title: "Cookie Consent Banner",
                  desc: "When you first visit our website, you'll see a cookie consent banner. You can accept all cookies, reject non-essential cookies, or customize your preferences.",
                },
                {
                  title: "Opt-Out Tools",
                  desc: "You can opt out of certain third-party cookies through:",
                  links: [
                    {
                      text: "Google Analytics Opt-out",
                      url: "https://tools.google.com/dlpage/gaoptout",
                    },
                    {
                      text: "Network Advertising Initiative",
                      url: "https://www.networkadvertising.org/choices/",
                    },
                  ],
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]"
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-2">
                    {item.desc}
                  </p>
                  {item.items && (
                    <div className="space-y-2">
                      {item.items.map((listItem, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-2.5 bg-white rounded-[12px] p-2.5 border border-[#e5e5e5]"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-neutral-600 font-medium">
                            {listItem}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.links && (
                    <div className="space-y-2">
                      {item.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-[#0a0a0a] underline font-medium hover:no-underline bg-white rounded-[12px] p-2.5 border border-[#e5e5e5]"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cookie Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Cookie Duration
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Session Cookies",
                  desc: "Temporary cookies that are deleted when you close your browser. Used for session management and shopping cart functionality.",
                },
                {
                  title: "Persistent Cookies",
                  desc: "Cookies that remain on your device for a set period (typically 30 days to 2 years) or until you delete them. Used for preferences, authentication, and analytics.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[16px] p-5 border border-[#e5e5e5]"
                >
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Updates to This Policy
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              We may update this Cookie Policy from time to time. We will notify
              you of any material changes by posting the updated policy on this
              page and updating the &quot;Last updated&quot; date.
            </p>
          </motion.div>

          {/* Manage Your Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <Settings className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                Manage Your Cookie Preferences
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              You can update your cookie preferences at any time. Click the
              button below to open the cookie settings panel.
            </p>
            <CookiePreferencesButton />
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 lg:p-10 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
              Questions About Cookies?
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              If you have questions about our use of cookies, please contact us
              at{" "}
              <a
                href="mailto:privacy@valuva.in"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                privacy@valuva.in
              </a>{" "}
              or refer to our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#0a0a0a] underline font-medium hover:no-underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>
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
