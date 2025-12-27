"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#e5e5e5] mt-16">
      <div className="container-luxury section-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-medium tracking-normal mb-4">
              VALUVA
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6 max-w-xs font-medium">
              Minimal luxury clothing with timeless design. Crafted for the
              modern minimalist.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:support@valuva.com"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors"
              >
                support@valuva.com
              </a>
              <a
                href="tel:+911234567890"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors"
              >
                +91 123 456 7890
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-medium tracking-normal mb-4">
              Shop
            </h3>
            <div className="space-y-2">
              <Link
                href="/shop"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                All Products
              </Link>
              <Link
                href="/shop?isFeatured=true"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Featured
              </Link>
              <Link
                href="/shop?isNewArrival=true"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="text-xs font-medium tracking-normal mb-4">
              Service
            </h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Contact
              </Link>
              <Link
                href="/shipping"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Shipping
              </Link>
              <Link
                href="/returns"
                className="block text-xs text-neutral-600 hover:text-[#0a0a0a] transition-colors font-medium"
              >
                Returns
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-[#e5e5e5] pt-6 mb-8">
          <h3 className="text-xs font-medium tracking-normal mb-3">
            Newsletter
          </h3>
          <p className="text-sm text-neutral-600 mb-4 max-w-md font-medium">
            Stay updated with our latest products and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Email"
              className="input-luxury flex-1"
            />
            <button type="submit" className="btn-luxury whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e5e5e5] pt-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 font-medium tracking-normal">
              © {new Date().getFullYear()} VALUVA. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs font-medium tracking-normal">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
