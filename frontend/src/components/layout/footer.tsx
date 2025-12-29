"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { newsletterApi } from "@/services/api/newsletter";
import { ArrowRight, CheckCircle, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
      <div className="container-luxury py-8 sm:py-10 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand Section - Centered on mobile */}
          <div className="space-y-4 sm:space-y-5 text-center sm:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group justify-center sm:justify-start"
            >
              <div className="relative w-10 h-10 sm:w-9 sm:h-9">
                <Image
                  src="/valuvaLogo.png"
                  alt="VALUVA"
                  fill
                  className="object-contain group-hover:opacity-80 transition-opacity"
                  priority
                />
              </div>
              <span className="text-base sm:text-sm font-medium tracking-tight text-[#0a0a0a]">
                valuva
              </span>
            </Link>
            <p className="text-xs sm:text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto sm:mx-0 font-medium">
              Minimal luxury clothing with timeless design. Crafted for the
              modern minimalist.
            </p>
            <div className="space-y-2.5 pt-2 flex flex-col items-center sm:items-start">
              <a
                href="mailto:support@valuva.in"
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group"
                aria-label="Email support"
              >
                <Mail className="h-3.5 w-3.5 group-hover:scale-105 transition-transform flex-shrink-0" />
                <span className="truncate">support@valuva.in</span>
              </a>
              <a
                href="tel:+9118000000000"
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group"
                aria-label="Phone number"
              >
                <Phone className="h-3.5 w-3.5 group-hover:scale-105 transition-transform flex-shrink-0" />
                <span>+91 1800 000 0000</span>
              </a>
            </div>
          </div>

          {/* Shop Links - Centered on mobile */}
          <div className="space-y-4 sm:space-y-3 text-center sm:text-left">
            <h3 className="text-xs font-medium tracking-normal text-[#0a0a0a] uppercase tracking-wider">
              Shop
            </h3>
            <nav
              className="flex flex-col gap-2.5 sm:gap-2"
              aria-label="Shop navigation"
            >
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service Links - Centered on mobile */}
          <div className="space-y-4 sm:space-y-3 text-center sm:text-left">
            <h3 className="text-xs font-medium tracking-normal text-[#0a0a0a] uppercase tracking-wider">
              Service
            </h3>
            <nav
              className="flex flex-col gap-2.5 sm:gap-2"
              aria-label="Service navigation"
            >
              {footerLinks.service.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter - Centered on mobile */}
          <div className="space-y-4 sm:space-y-3 text-center sm:text-left">
            <h3 className="text-xs font-medium tracking-normal text-[#0a0a0a] uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-xs text-neutral-600 font-medium leading-relaxed max-w-xs mx-auto sm:mx-0">
              Stay updated with our latest products and exclusive offers.
            </p>
            {isSubscribed ? (
              <div className="flex items-center justify-center sm:justify-start gap-2 p-3 bg-green-50 border border-green-200 rounded-[10px] max-w-xs mx-auto sm:mx-0">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs font-medium text-green-900">
                  Successfully subscribed!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="space-y-2 max-w-xs mx-auto sm:mx-0"
                aria-label="Newsletter subscription"
              >
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pr-11 h-10 rounded-[10px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-xs bg-[#fafafa] focus:bg-white transition-colors w-full"
                    required
                    disabled={isSubmitting}
                    aria-label="Email address"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="filled"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-[8px] disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar - Centered on mobile */}
        <div className="border-t border-[#e5e5e5] pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-6">
            <p className="text-xs text-neutral-500 font-medium text-center sm:text-left order-2 sm:order-1">
              © {new Date().getFullYear()} VALUVA. All rights reserved.
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-xs font-medium order-1 sm:order-2"
              aria-label="Legal navigation"
            >
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-600 hover:text-[#0a0a0a] transition-colors"
                >
                  {link.label}
                  {index < footerLinks.legal.length - 1 && (
                    <span className="mx-2 text-neutral-300 hidden sm:inline">
                      •
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
