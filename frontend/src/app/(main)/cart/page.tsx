"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/use-analytics";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { couponsService } from "@/services";
import { Coupon } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const analytics = useAnalytics();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-10 sm:py-12">
          <Skeleton className="h-10 w-48 mb-8 rounded-[16px]" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-32 sm:h-40 w-full rounded-[20px]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cart = data?.data;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (!cart || cart.items.length === 0) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const coupon = await couponsService.validateCoupon(
        couponCode.trim().toUpperCase(),
        cart.subtotal
      );

      if (!coupon.isActive) {
        throw new Error("This coupon is not active");
      }

      const now = new Date();
      const startsAt = new Date(coupon.startsAt);
      const expiresAt = new Date(coupon.expiresAt);

      if (now < startsAt) {
        throw new Error("This coupon is not yet valid");
      }

      if (now > expiresAt) {
        throw new Error("This coupon has expired");
      }

      if (coupon.minPurchase && cart.subtotal < coupon.minPurchase) {
        throw new Error(
          `Minimum purchase of ${formatPrice(coupon.minPurchase)} required`
        );
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new Error("This coupon has reached its usage limit");
      }

      setAppliedCoupon(coupon);
      setCouponCode("");
      toast({
        title: "Coupon applied!",
        description: `You saved ${formatPrice(
          calculateDiscount(coupon, cart.subtotal)
        )}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to apply coupon. Please check the code and try again.";
      setCouponError(errorMessage);
      toast({
        title: "Coupon Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your cart",
    });
  };

  const calculateDiscount = (coupon: Coupon, subtotal: number): number => {
    if (coupon.discountType === "PERCENTAGE") {
      const discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        return Math.min(discount, coupon.maxDiscount);
      }
      return discount;
    } else {
      return Math.min(coupon.discountValue, subtotal);
    }
  };

  const getDiscountAmount = (): number => {
    if (!appliedCoupon || !cart) return 0;
    return calculateDiscount(appliedCoupon, cart.subtotal);
  };

  const getTotal = (): number => {
    if (!cart) return 0;
    return Math.max(0, cart.subtotal - getDiscountAmount());
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
          >
            <ShoppingBag className="h-8 w-8 text-neutral-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#0a0a0a]">
              Your cart is empty
            </h1>
            <p className="text-sm text-neutral-400 font-normal">
              Add some items to get started
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/shop" className="inline-block">
              <Button size="sm" variant="filled" className="gap-1.5">
                Start Shopping
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Modern Design */}
      <section className="relative border-b border-[#f5f5f5] bg-gradient-to-b from-white via-white to-[#fafafa]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01),transparent_70%)]" />
        <div className="container-luxury py-10 sm:py-12 md:py-16 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#0a0a0a]"
          >
            Shopping Cart
          </motion.h1>
        </div>
      </section>

      {/* Main Content - Modern Layout */}
      <section className="container-luxury py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Cart Items - Refined */}
          <div className="lg:col-span-8 space-y-3">
            <AnimatePresence>
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -1 }}
                  className="flex gap-4 sm:gap-5 p-5 bg-white border border-[#f5f5f5] rounded-[20px] hover:border-[#e5e5e5] hover:shadow-sm transition-all duration-300"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 border border-[#f5f5f5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[14px]">
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-normal tracking-normal text-[#0a0a0a] hover:opacity-70 transition-opacity block mb-1.5"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-neutral-400 font-normal mb-2">
                      Size: {item.variant.size} • Color: {item.variant.color}
                    </p>
                    <p className="text-sm font-normal mb-3 text-[#0a0a0a]">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#f5f5f5] rounded-[12px] overflow-hidden bg-[#fafafa]">
                        <button
                          onClick={() =>
                            updateItem.mutate({
                              itemId: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-normal text-[#0a0a0a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItem.mutate({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          removeItem.mutate(item.id, {
                            onSuccess: () => {
                              // Track analytics
                              analytics.trackRemoveFromCart(
                                item.product.id,
                                item.variantId,
                                item.quantity
                              );
                            },
                          });
                        }}
                        className="ml-auto w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-[12px]"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary - Refined */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border border-[#f5f5f5] p-6 bg-white sticky top-24 rounded-[20px] shadow-sm hover:shadow-sm transition-shadow duration-300"
            >
              <h2 className="text-sm font-normal tracking-normal mb-5 border-b border-[#f5f5f5] pb-4 text-[#0a0a0a]">
                Order Summary
              </h2>

              {/* Coupon Code - Refined */}
              <div className="mb-5 pb-5 border-b border-[#f5f5f5]">
                {appliedCoupon ? (
                  <div className="bg-green-50/50 border border-green-200/50 rounded-[14px] p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-normal text-green-900 truncate">
                            {appliedCoupon.code}
                          </p>
                          {appliedCoupon.description && (
                            <p className="text-[10px] text-green-700 font-normal mt-0.5 line-clamp-1">
                              {appliedCoupon.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-700 hover:text-green-900 transition-colors flex-shrink-0"
                        aria-label="Remove coupon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200/50">
                      <span className="text-xs font-normal text-green-700">
                        Discount:
                      </span>
                      <span className="text-sm font-normal text-green-900">
                        -{formatPrice(getDiscountAmount())}
                      </span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon}>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <Input
                          type="text"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError(null);
                          }}
                          className={`pl-10 h-10 rounded-[12px] border text-xs bg-[#fafafa] ${
                            couponError
                              ? "border-red-300 focus:border-red-500"
                              : "border-[#f5f5f5] focus:border-[#d0d0d0] focus:bg-white"
                          }`}
                          disabled={isApplyingCoupon}
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="rounded-[12px] h-10 px-4 border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
                        {isApplyingCoupon ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-600 font-normal mt-2">
                        {couponError}
                      </p>
                    )}
                  </form>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-xs font-normal text-neutral-400">
                    Subtotal
                  </span>
                  <span className="font-normal text-[#0a0a0a]">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                {appliedCoupon && getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-xs font-normal text-green-600 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="text-xs font-normal text-green-600">
                      -{formatPrice(getDiscountAmount())}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-xs font-normal text-neutral-400 flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" />
                    Shipping
                  </span>
                  <span className="text-xs font-normal text-neutral-400">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-[#f5f5f5] pt-3 flex justify-between">
                  <span className="text-sm font-normal text-[#0a0a0a]">
                    Total
                  </span>
                  <span className="text-base font-normal text-[#0a0a0a]">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href={
                    appliedCoupon
                      ? `/checkout?coupon=${appliedCoupon.code}`
                      : "/checkout"
                  }
                  onClick={() => {
                    if (appliedCoupon) {
                      localStorage.setItem(
                        "appliedCoupon",
                        JSON.stringify({
                          code: appliedCoupon.code,
                          discountAmount: getDiscountAmount(),
                        })
                      );
                    }
                  }}
                  className="block"
                >
                  <Button size="sm" variant="filled" className="w-full gap-1.5">
                    Proceed to Checkout
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>

                <Link href="/shop">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
