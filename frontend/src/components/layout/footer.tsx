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
      <div className="container-luxury py-6 sm:py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src="/valuvaLogo.png"
                  alt="VALUVA"
                  fill
                  className="object-contain group-hover:opacity-80 transition-opacity"
                />
              </div>
              <span className="text-sm sm:text-base font-medium tracking-tight text-[#0a0a0a]">
                valuva
              </span>
            </Link>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-xs font-medium">
              Minimal luxury clothing with timeless design. Crafted for the
              modern minimalist.
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="mailto:support@valuva.in"
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group"
              >
                <Mail className="h-3.5 w-3.5 group-hover:scale-105 transition-transform flex-shrink-0" />
                <span className="truncate">support@valuva.in</span>
              </a>
              <a
                href="tel:+9118000000000"
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group"
              >
                <Phone className="h-3.5 w-3.5 group-hover:scale-105 transition-transform flex-shrink-0" />
                <span>+91 1800 000 0000</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium tracking-normal text-[#0a0a0a] uppercase tracking-wider">
              Shop
            </h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium tracking-normal text-[#0a0a0a] uppercase tracking-wider">
              Service
            </h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.service.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium tracking-normal text-[#0a0a0a] uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
              Stay updated with our latest products and exclusive offers.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[10px]">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs font-medium text-green-900">
                  Successfully subscribed!
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pr-11 h-10 rounded-[10px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-xs bg-[#fafafa] focus:bg-white transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="filled"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-[8px] disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e5e5e5] pt-5 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 font-medium">
              © {new Date().getFullYear()} VALUVA. All rights reserved.
            </p>
            <nav className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs font-medium">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-600 hover:text-[#0a0a0a] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
