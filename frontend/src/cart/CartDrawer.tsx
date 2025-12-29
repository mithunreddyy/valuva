"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { couponsService } from "@/services";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  closeCart,
  removeCartItem,
  updateCartItem,
} from "@/store/slices/cartSlice";
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
import { useEffect, useState } from "react";

export const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const { cart, isOpen, isLoading } = useAppSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => dispatch(closeCart());

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeCartItem(itemId));
  };

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

      // Validate coupon eligibility
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
      // FIXED_AMOUNT
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

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#fafafa] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-white border-b border-[#e5e5e5] px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-[#0a0a0a]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-medium tracking-normal text-[#0a0a0a]">
                    Shopping Cart
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    {cart?.itemCount || 0}{" "}
                    {cart?.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-[12px] hover:bg-[#fafafa] transition-colors"
                aria-label="Close cart"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : !cart || cart.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full flex-col items-center justify-center text-center space-y-6 px-4"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-neutral-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-medium tracking-normal text-[#0a0a0a]">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-neutral-500 font-medium">
                      Add items to get started
                    </p>
                  </div>
                  <Link href="/shop" onClick={handleClose}>
                    <Button
                      variant="filled"
                      size="lg"
                      className="rounded-[16px] gap-2"
                    >
                      Continue Shopping
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-[#e5e5e5] rounded-[20px] p-4 sm:p-5 hover:border-[#0a0a0a] transition-all duration-300"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Image */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={handleClose}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 border border-[#e5e5e5] rounded-[16px] overflow-hidden bg-[#fafafa] flex-shrink-0 hover:opacity-90 transition-opacity"
                        >
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-neutral-300" />
                            </div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex flex-1 flex-col min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={handleClose}
                            className="text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] hover:opacity-70 transition-opacity line-clamp-2 mb-2"
                          >
                            {item.product.name}
                          </Link>

                          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500 font-medium">
                            <span>Size: {item.variant.size}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                              <span>Color: {item.variant.color}</span>
                              {item.variant.colorHex && (
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-[#e5e5e5]"
                                  style={{
                                    backgroundColor: item.variant.colorHex,
                                  }}
                                />
                              )}
                            </span>
                          </div>

                          <div className="mt-auto flex items-center justify-between gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-[#fafafa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium text-[#0a0a0a]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-[#fafafa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity >= item.variant.stock}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Price & Remove */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm sm:text-base font-medium text-[#0a0a0a]">
                                {formatPrice(item.subtotal)}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-[12px]"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="bg-white border-t border-[#e5e5e5] px-4 sm:px-6 py-5 sm:py-6 flex-shrink-0">
                {/* Coupon Code */}
                <div className="mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-[#e5e5e5]">
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-[12px] p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-900 truncate">
                              {appliedCoupon.code}
                            </p>
                            {appliedCoupon.description && (
                              <p className="text-xs text-green-700 font-medium mt-0.5 line-clamp-1">
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
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200">
                        <span className="text-xs font-medium text-green-700">
                          Discount:
                        </span>
                        <span className="text-sm font-medium text-green-900">
                          -{formatPrice(getDiscountAmount())}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon}>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <Input
                            type="text"
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              setCouponError(null);
                            }}
                            className={`pl-10 h-10 rounded-[12px] border text-sm bg-transparent ${
                              couponError
                                ? "border-red-300 focus:border-red-500"
                                : "border-[#e5e5e5] focus:border-[#0a0a0a]"
                            }`}
                            disabled={isApplyingCoupon}
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="rounded-[12px] h-10 px-4"
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
                        <p className="text-xs text-red-600 font-medium mt-2">
                          {couponError}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Order Summary */}
                <div className="mb-4 sm:mb-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xs font-medium text-neutral-500">
                      Subtotal
                    </span>
                    <span className="text-sm font-medium text-[#0a0a0a]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                  {appliedCoupon && getDiscountAmount() > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        Discount ({appliedCoupon.code})
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        -{formatPrice(getDiscountAmount())}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5" />
                      Shipping
                    </span>
                    <span className="text-xs font-medium text-neutral-500">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-[#e5e5e5] pt-3 flex items-center justify-between">
                    <span className="text-base font-medium tracking-normal text-[#0a0a0a]">
                      Total
                    </span>
                    <span className="text-lg font-medium tracking-normal text-[#0a0a0a]">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <Link
                    href={
                      appliedCoupon
                        ? `/checkout?coupon=${appliedCoupon.code}`
                        : "/checkout"
                    }
                    onClick={() => {
                      // Store coupon in localStorage for checkout page
                      if (appliedCoupon) {
                        localStorage.setItem(
                          "appliedCoupon",
                          JSON.stringify({
                            code: appliedCoupon.code,
                            discountAmount: getDiscountAmount(),
                          })
                        );
                      }
                      handleClose();
                    }}
                    className="block"
                  >
                    <Button
                      variant="filled"
                      size="lg"
                      className="w-full rounded-[16px] text-sm sm:text-base font-medium gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    size="lg"
                    className="w-full rounded-[16px] text-sm sm:text-base font-medium"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
