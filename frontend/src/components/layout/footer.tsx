"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { newsletterApi } from "@/services/api/newsletter";
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
import { useEffect, useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState<{
    shop: boolean;
    service: boolean;
    newsletter: boolean;
    legal: boolean;
  }>({
    shop: false,
    service: false,
    newsletter: false,
    legal: false,
  });

  // Open sections by default on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setOpenSections({
        shop: true,
        service: true,
        newsletter: true,
        legal: true,
      });
    }
  }, []);

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
      setIsSubmitting(true);
      await newsletterApi.subscribe(email);
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    <footer className="w-full bg-white border-t border-[#e5e5e5] mt-8 sm:mt-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main Footer Content - Three Column Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16">
            {/* Left: VALUVA Text and Description */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4 sm:mb-5">
                  valuva
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium max-w-md">
                  Sacred geometry meeting contemporary elegance. Rooted in
                  Telugu heritage, tailored for the modern spirit.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <a
                  href="mailto:support@valuva.in"
                  className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group underline underline-offset-4"
                  aria-label="Email support"
                >
                  <Mail className="h-4 w-4 group-hover:scale-105 transition-transform flex-shrink-0" />
                  <span>support@valuva.in</span>
                </a>
                <a
                  href="tel:+9118000000000"
                  className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group underline underline-offset-4"
                  aria-label="Phone number"
                >
                  <Phone className="h-4 w-4 group-hover:scale-105 transition-transform flex-shrink-0" />
                  <span>+91 1800 000 0000</span>
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="pt-2">
                <p className="text-xs text-neutral-500 font-medium mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {socialMediaLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-[10px] border border-[#e5e5e5] bg-white hover:bg-[#0a0a0a] hover:border-[#0a0a0a] text-neutral-600 hover:text-white transition-all duration-200 group"
                        aria-label={social.ariaLabel}
                        title={social.name}
                      >
                        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Center: Large VALUVA Logo */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                <Image
                  src="/valuvaLogo.png"
                  alt="VALUVA"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right: Collapsible Sections */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5">
              {/* Shop Section */}
              <div className="border-b border-[#e5e5e5] pb-4 sm:pb-5">
                <button
                  onClick={() => toggleSection("shop")}
                  className="flex items-center justify-between w-full text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] hover:opacity-80 transition-opacity"
                  aria-expanded={openSections.shop}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                      openSections.shop ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.shop && (
                  <nav
                    className="mt-4 space-y-2.5"
                    aria-label="Shop navigation"
                  >
                    {footerLinks.shop.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>

              {/* Service Section */}
              <div className="border-b border-[#e5e5e5] pb-4 sm:pb-5">
                <button
                  onClick={() => toggleSection("service")}
                  className="flex items-center justify-between w-full text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] hover:opacity-80 transition-opacity"
                  aria-expanded={openSections.service}
                >
                  <span>Service</span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                      openSections.service ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.service && (
                  <nav
                    className="mt-4 space-y-2.5"
                    aria-label="Service navigation"
                  >
                    {footerLinks.service.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>

              {/* Newsletter Section */}
              <div className="border-b border-[#e5e5e5] pb-4 sm:pb-5">
                <button
                  onClick={() => toggleSection("newsletter")}
                  className="flex items-center justify-between w-full text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] hover:opacity-80 transition-opacity"
                  aria-expanded={openSections.newsletter}
                >
                  <span>Newsletter</span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                      openSections.newsletter ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.newsletter && (
                  <div className="mt-4 space-y-3">
                    {isSubscribed ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[10px]">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <p className="text-xs font-medium text-green-900">
                          Successfully subscribed!
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleNewsletterSubmit}
                        className="space-y-2"
                        aria-label="Newsletter subscription"
                      >
                        <div className="relative">
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="EMAIL ADDRESS"
                            className="h-10 sm:h-11 rounded-[10px] border-b-2 border-t-0 border-l-0 border-r-0 border-[#e5e5e5] focus:border-[#0a0a0a] text-xs sm:text-sm bg-transparent focus:bg-transparent transition-colors w-full placeholder:text-neutral-400"
                            required
                            disabled={isSubmitting}
                            aria-label="Email address"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-[8px] disabled:opacity-50"
                            disabled={isSubmitting}
                            aria-label="Subscribe to newsletter"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Legal Section */}
              <div>
                <button
                  onClick={() => toggleSection("legal")}
                  className="flex items-center justify-between w-full text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] hover:opacity-80 transition-opacity"
                  aria-expanded={openSections.legal}
                >
                  <span>Legal</span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                      openSections.legal ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.legal && (
                  <nav
                    className="mt-4 space-y-2.5"
                    aria-label="Legal navigation"
                  >
                    {footerLinks.legal.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar - Copyright - Full Width */}
          <div className="w-full border-t border-[#e5e5e5] mt-6 sm:mt-8">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs text-neutral-500 font-medium">
                  © {new Date().getFullYear()} VALUVA STUDIO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
