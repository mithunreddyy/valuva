"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletter } from "@/hooks/use-newsletter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const { isSubscribed, isSubmitting, subscribe, resetSubscription } =
    useNewsletter();
  const [openSections, setOpenSections] = useState<{
    shop: boolean;
    service: boolean;
    legal: boolean;
  }>({
    shop: false,
    service: false,
    legal: false,
  });

  // Toggle sections independently - all stay closed by default
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    try {
      await subscribe(email);
      setEmail("");
      // Reset success state after 5 seconds
      setTimeout(() => {
        resetSubscription();
      }, 5000);
    } catch {
      // Error handled by hook
    }
  };

  // Dynamic social media links configuration
  const socialMediaLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com/valuva",
      icon: Instagram,
      ariaLabel: "Follow us on Instagram",
    },
    // {
    //   name: "Facebook",
    //   url: "https://facebook.com/valuva",
    //   icon: Facebook,
    //   ariaLabel: "Follow us on Facebook",
    // },
    // {
    //   name: "Twitter",
    //   url: "https://twitter.com/valuva",
    //   icon: Twitter,
    //   ariaLabel: "Follow us on Twitter",
    // },
    // {
    //   name: "YouTube",
    //   url: "https://youtube.com/@valuva",
    //   icon: Youtube,
    //   ariaLabel: "Subscribe to our YouTube channel",
    // },
    // {
    //   name: "LinkedIn",
    //   url: "https://linkedin.com/company/valuva",
    //   icon: Linkedin,
    //   ariaLabel: "Connect with us on LinkedIn",
    // },
  ];

  const footerLinks = {
    shop: [
      { href: "/shop", label: "All Products" },
      { href: "/shop?isFeatured=true", label: "Featured" },
      { href: "/shop?isNewArrival=true", label: "New Arrivals" },
      { href: "/about", label: "About" },
    ],
    service: [
      { href: "/contact", label: "Contact" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/faq", label: "FAQ" },
    ],
    legal: [
      { href: "/privacy-policy", label: "Privacy" },
      { href: "/terms-of-service", label: "Terms" },
      { href: "/cookie-policy", label: "Cookies" },
    ],
  };

  return (
    <footer className="w-full mt-8 sm:mt-10">
      <div className="container-luxury">
        <div className="header-glass header-container">
          <div className="px-4 sm:px-6 py-8 sm:py-10">
            {/* Row 1: Brand and Contact with Logo */}
            <div className="mb-4 sm:mb-4 text-center md:text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-5">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
                  <Image
                    src="/valuvaLogo.png"
                    alt="VALUVA"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {/* <span className="text-base sm:text-lg md:text-xl font-medium tracking-tight text-[#0a0a0a]">
                  valuva
                </span> */}
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium max-w-md mx-auto mb-4 sm:mb-5">
                Sacred geometry meeting contemporary elegance. Rooted in Telugu
                heritage, tailored for the modern spirit.
              </p>
              <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5 flex flex-col items-center">
                <a
                  href="mailto:support@valuva.in"
                  className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium hover-opacity justify-center"
                  aria-label="Email support"
                >
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>support@valuva.in</span>
                </a>
                <a
                  href="tel:+9118000000000"
                  className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium hover-opacity justify-center"
                  aria-label="Phone number"
                >
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>+91 1800 000 0000</span>
                </a>
              </div>
              {/* Social Media Icons */}
              <div className="flex flex-col items-center">
                <p className="text-xs text-neutral-500 font-medium mb-2 sm:mb-2.5">
                  Follow Us
                </p>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {socialMediaLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-[10px] border border-[#e5e5e5] hover:border-[#0a0a0a] hover:bg-[#0a0a0a] text-neutral-600 hover:text-white transition-all duration-300 hover-opacity"
                        aria-label={social.ariaLabel}
                        title={social.name}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: Shop, Service, Legal - 3 Columns Always */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              {/* Shop Section */}
              <div className="text-center">
                <button
                  onClick={() => toggleSection("shop")}
                  className="flex items-center justify-center w-full text-[10px] sm:text-xs md:text-sm font-medium tracking-normal text-[#0a0a0a] hover-opacity transition-opacity py-1 gap-1"
                  aria-expanded={openSections.shop}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 flex-shrink-0 ${
                      openSections.shop ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.shop && (
                    <motion.nav
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5"
                      aria-label="Shop navigation"
                    >
                      {footerLinks.shop.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block text-[10px] sm:text-xs md:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium hover-opacity text-center"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>

              {/* Service Section */}
              <div className="text-center">
                <button
                  onClick={() => toggleSection("service")}
                  className="flex items-center justify-center w-full text-[10px] sm:text-xs md:text-sm font-medium tracking-normal text-[#0a0a0a] hover-opacity transition-opacity py-1 gap-1"
                  aria-expanded={openSections.service}
                >
                  <span>Service</span>
                  <ChevronDown
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 flex-shrink-0 ${
                      openSections.service ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.service && (
                    <motion.nav
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5"
                      aria-label="Service navigation"
                    >
                      {footerLinks.service.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block text-[10px] sm:text-xs md:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium hover-opacity text-center"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>

              {/* Legal Section */}
              <div className="text-center">
                <button
                  onClick={() => toggleSection("legal")}
                  className="flex items-center justify-center w-full text-[10px] sm:text-xs md:text-sm font-medium tracking-normal text-[#0a0a0a] hover-opacity transition-opacity py-1 gap-1"
                  aria-expanded={openSections.legal}
                >
                  <span>Legal</span>
                  <ChevronDown
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 flex-shrink-0 ${
                      openSections.legal ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.legal && (
                    <motion.nav
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5"
                      aria-label="Legal navigation"
                    >
                      {footerLinks.legal.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block text-[10px] sm:text-xs md:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium hover-opacity text-center"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Row 5: Newsletter - Always Visible */}
            <div className="mb-4 sm:mb-5 text-center flex flex-col items-center">
              <h3 className="text-xs sm:text-sm font-medium tracking-normal text-[#0a0a0a] mb-2 sm:mb-3">
                Newsletter
              </h3>
              {isSubscribed ? (
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-[10px]">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-green-900">
                    Successfully subscribed!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-2 w-full flex justify-center"
                  aria-label="Newsletter subscription"
                >
                  <div className="relative max-w-md w-full mx-auto">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-9 sm:h-10 md:h-11 rounded-[10px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-xs sm:text-sm bg-transparent focus:bg-transparent transition-colors w-full placeholder:text-neutral-400 pr-10 sm:pr-12"
                      required
                      disabled={isSubmitting}
                      aria-label="Email address"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-[8px] disabled:opacity-50 hover:bg-transparent"
                      disabled={isSubmitting}
                      aria-label="Subscribe to newsletter"
                    >
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Bar - Copyright */}
            <div className="border-t border-[#e5e5e5] pt-3 sm:pt-4">
              <p className="text-xs text-neutral-500 font-medium text-center">
                © {new Date().getFullYear()} VALUVA STUDIO
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
