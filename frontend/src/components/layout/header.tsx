"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { openCart } from "@/store/slices/cartSlice";
import { fetchWishlist } from "@/store/slices/wishlistSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await dispatch(logout());
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const cartItemCount = cart?.itemCount || 0;
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container-luxury">
        <div className="header-glass header-container">
          <div className="flex items-center justify-between h-12 sm:h-14 px-4 sm:px-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover-opacity transition-opacity"
            >
              <Image
                src="/valuvaLogo.png"
                alt="VALUVA"
                width={32}
                height={32}
                className="object-contain w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="hidden sm:block text-base sm:text-lg font-medium tracking-normal">
                VALUVA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/shop"
                className="text-sm font-medium tracking-normal hover-opacity transition-opacity"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium tracking-normal hover-opacity transition-opacity"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push("/search")}
                className="p-2 hover-opacity transition-opacity rounded-[10px]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="relative p-2 hover-opacity transition-opacity rounded-[10px]"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center bg-[#0a0a0a] text-[#fafafa] text-[10px] font-normal rounded-full">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <button
                className="relative p-2 hover-opacity transition-opacity rounded-[10px]"
                onClick={() => dispatch(openCart())}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center bg-[#0a0a0a] text-[#fafafa] text-[10px] font-normal rounded-full">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="hidden md:flex items-center gap-2 px-3 py-2 border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all rounded-[10px]"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="flex h-6 w-6 items-center justify-center bg-[#0a0a0a] text-[#fafafa] text-xs font-normal rounded-full">
                      {user?.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  </button>
                  <button
                    className="md:hidden p-2 hover-opacity transition-opacity rounded-[10px]"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-[#e5e5e5] shadow-lg rounded-[12px] overflow-hidden"
                      >
                        <div className="p-4 border-b border-[#e5e5e5]">
                          <p className="text-sm font-medium tracking-normal mb-1">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium tracking-normal hover:bg-[#fafafa] transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Account
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium tracking-normal hover:bg-[#fafafa] transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="h-4 w-4" />
                            Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium tracking-normal hover:bg-[#fafafa] transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="h-4 w-4" />
                            Wishlist
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium tracking-normal text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center justify-center px-4 py-2 text-sm font-medium tracking-normal border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#fafafa] transition-all rounded-[10px]"
                >
                  Login
                </Link>
              )}

              <button
                className="md:hidden p-2 hover-opacity transition-opacity rounded-[10px]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden container-luxury"
          >
            <div className="header-glass header-container mt-2 rounded-[16px] overflow-hidden">
              <div className="px-4 sm:px-6 py-6">
                <nav className="space-y-4">
                  <Link
                    href="/shop"
                    className="block text-sm font-medium tracking-normal hover-opacity transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link
                    href="/about"
                    className="block text-sm font-medium tracking-normal hover-opacity transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block text-sm font-medium tracking-normal hover-opacity transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-2 text-xs text-neutral-500">
                        ({wishlistCount})
                      </span>
                    )}
                  </Link>
                  {!isAuthenticated && (
                    <Link
                      href="/login"
                      className="block text-sm font-medium tracking-normal hover-opacity transition-opacity"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
