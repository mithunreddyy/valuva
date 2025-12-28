"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail("");
  };

  return (
    <footer className="w-full bg-white border-t border-[#e5e5e5] mt-12 sm:mt-16">
      <div className="container-luxury py-4 sm:py-6 lg:py-8">  
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/valuvaLogo.png"
                alt="VALUVA"
                width={40}
                height={40}
                className="object-contain w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-base sm:text-lg font-medium tracking-tight text-[#0a0a0a]">
                valuva
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xs font-medium">
              Minimal luxury clothing with timeless design. Crafted for the
              modern minimalist.
            </p>
            <div className="space-y-2.5">
              <a
                href="mailto:support@valuva.com"
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group"
              >
                <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                support@valuva.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium group"
              >
                <Phone className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                +91 123 456 7890
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-normal text-[#0a0a0a]">
              Shop
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/shop"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                All Products
              </Link>
              <Link
                href="/shop?isFeatured=true"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Featured
              </Link>
              <Link
                href="/shop?isNewArrival=true"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Service Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-normal text-[#0a0a0a]">
              Service
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/contact"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Contact
              </Link>
              <Link
                href="/shipping"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Shipping
              </Link>
              <Link
                href="/returns"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Returns
              </Link>
              <Link
                href="/faq"
                className="text-xs sm:text-sm text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-normal text-[#0a0a0a]">
              Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
              Stay updated with our latest products and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pr-12 h-11 rounded-[16px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="filled"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded-[12px]"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e5e5e5] pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 font-medium tracking-normal">
              © {new Date().getFullYear()} VALUVA. All rights reserved.
            </p>
            <nav className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium tracking-normal">
              <Link
                href="/privacy"
                className="text-neutral-600 hover:text-[#0a0a0a] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-neutral-600 hover:text-[#0a0a0a] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-neutral-600 hover:text-[#0a0a0a] transition-colors"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
