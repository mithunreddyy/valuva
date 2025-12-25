"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { itemCount } = useCartStore();

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/valuvaLogo.png"
              alt="Valuva"
              width={120}
              height={80}
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/shop?isFeatured=true"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
            >
              Featured
            </Link>
            <Link
              href="/shop?isNewArrival=true"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <Button variant="ghost" size="icon">
                <Link href="/dashboard">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/shop"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/shop?isFeatured=true"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Featured
            </Link>
            <Link
              href="/shop?isNewArrival=true"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-neutral-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
