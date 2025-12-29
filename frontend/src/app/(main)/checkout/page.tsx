"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAddresses } from "@/hooks/use-addresses";
import { useAnalytics } from "@/hooks/use-analytics";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useRazorpay } from "@/hooks/use-razorpay";
import { InputSanitizer } from "@/lib/input-sanitizer";
import { formatPrice } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Please select a shipping address"),
  billingAddressId: z.string().min(1, "Please select a billing address"),
  paymentMethod: z.enum([
    "COD",
    "UPI",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "RAZORPAY",
  ]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const analytics = useAnalytics();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const createOrder = useCreateOrder();
  const { openRazorpayCheckout, isLoading: isRazorpayLoading } = useRazorpay();
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Track checkout started
  useEffect(() => {
    if (cartData?.data && cartData.data.items.length > 0) {
      analytics.trackCheckoutStarted({
        itemCount: cartData.data.items.length,
        subtotal: Number(cartData.data.subtotal),
      });
    }
  }, [cartData, analytics]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  const shippingAddressId = watch("shippingAddressId");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (addressesData?.data && addressesData.data.length > 0) {
      const defaultAddress = addressesData.data.find((a) => a.isDefault);
      if (defaultAddress) {
        setValue("shippingAddressId", defaultAddress.id);
        setValue("billingAddressId", defaultAddress.id);
      }
    }
  }, [addressesData, setValue]);

  useEffect(() => {
    if (shippingAddressId) {
      setValue("billingAddressId", shippingAddressId);
    }
  }, [shippingAddressId, setValue]);

  if (cartLoading || addressesLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cartData?.data || cartData.data.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container-luxury text-center space-y-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
            Your cart is empty
          </h1>
          <Button
            onClick={() => router.push("/shop")}
            size="lg"
            variant="filled"
            className="rounded-[16px]"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  const cart = cartData.data;
  const addresses = addressesData?.data || [];

  const onSubmit = async (data: CheckoutForm) => {
    try {
      // Sanitize form data
      const sanitizedData = {
        ...data,
        notes: data.notes
          ? InputSanitizer.sanitizeString(data.notes, { maxLength: 500 })
          : undefined,
      };

      const order = await createOrder.mutateAsync(sanitizedData);
      const orderId = order.data.id;

      // If payment method is Razorpay, open Razorpay checkout
      if (data.paymentMethod === "RAZORPAY") {
        setCreatedOrderId(orderId);
        await openRazorpayCheckout(
          orderId,
          (successOrderId) => {
            // Track order completion
            analytics.trackOrderCompleted(
              successOrderId,
              order.data.orderNumber,
              Number(order.data.total),
              order.data.items.length,
              data.paymentMethod
            );
            router.push(`/dashboard/orders/${successOrderId}`);
          },
          (error) => {
            console.error("Razorpay payment error:", error);
            // Order is already created, redirect to order page
            router.push(`/dashboard/orders/${orderId}`);
          }
        );
      } else {
        // For COD and other methods, redirect immediately
        // Track order completion
        analytics.trackOrderCompleted(
          orderId,
          order.data.orderNumber,
          Number(order.data.total),
          order.data.items.length,
          data.paymentMethod
        );
        router.push(`/dashboard/orders/${orderId}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]"
          >
            Checkout
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-6 sm:py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="grid lg:grid-cols-12 gap-5 lg:gap-6"
          >
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Shipping Address */}
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <h2 className="text-lg font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Shipping Address
                </h2>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-500 font-medium mb-4">
                      No addresses found. Please add one.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/addresses")}
                      className="rounded-[10px]"
                    >
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-4 p-4 border cursor-pointer transition-all rounded-[10px] ${
                          shippingAddressId === address.id
                            ? "border-[#0a0a0a] bg-[#fafafa]"
                            : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                        }`}
                      >
                        <input
                          type="radio"
                          {...register("shippingAddressId")}
                          value={address.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium tracking-normal mb-2">
                            {address.fullName}
                          </p>
                          <p className="text-xs text-neutral-600 font-medium">
                            {address.addressLine1}
                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}
                          </p>
                          <p className="text-xs text-neutral-600 font-medium">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-xs text-neutral-600 font-medium">
                            {address.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {errors.shippingAddressId && (
                  <p className="text-red-600 text-xs mt-2 font-medium">
                    {errors.shippingAddressId.message}
                  </p>
                )}
              </div>

              {/* Billing Address */}
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <h2 className="text-lg font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Billing Address
                </h2>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-4 p-4 border cursor-pointer transition-all rounded-[10px] ${
                        watch("billingAddressId") === address.id
                          ? "border-[#0a0a0a] bg-[#fafafa]"
                          : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("billingAddressId")}
                        value={address.id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium tracking-normal mb-2">
                          {address.fullName}
                        </p>
                        <p className="text-xs text-neutral-600 font-medium">
                          {address.addressLine1}
                        </p>
                        <p className="text-xs text-neutral-600 font-medium">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.billingAddressId && (
                  <p className="text-red-600 text-xs mt-2 font-medium">
                    {errors.billingAddressId.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <h2 className="text-lg font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      value: "RAZORPAY",
                      label: "Razorpay (Cards, UPI, Wallets, Net Banking)",
                    },
                    { value: "COD", label: "Cash on Delivery" },
                    { value: "UPI", label: "UPI" },
                    { value: "CREDIT_CARD", label: "Credit Card" },
                    { value: "DEBIT_CARD", label: "Debit Card" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all rounded-[10px] ${
                        watch("paymentMethod") === method.value
                          ? "border-[#0a0a0a] bg-[#fafafa]"
                          : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value={method.value}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium tracking-normal">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px]">
                <h2 className="text-lg font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Order Notes (Optional)
                </h2>
                <Textarea
                  {...register("notes")}
                  className="input-luxury min-h-[100px] rounded-[10px]"
                  placeholder="Any special instructions for your order?"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#e5e5e5] p-5 rounded-[12px] sticky top-24">
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-3 border-b border-[#e5e5e5] last:border-0"
                    >
                      <div className="relative w-16 h-16 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[8px]">
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
                        <p className="text-xs font-medium tracking-normal line-clamp-1 mb-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-4 border-t border-[#e5e5e5] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-xs font-medium text-neutral-500">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-xs font-medium text-neutral-500">
                      Shipping
                    </span>
                    <span className="text-xs font-medium">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-[#e5e5e5] pt-4 flex justify-between text-lg font-medium">
                    <span className="text-sm">Total</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 font-medium text-center mb-4 leading-relaxed">
                  By placing your order, you agree to our{" "}
                  <Link
                    href="/terms-of-service"
                    className="text-[#0a0a0a] underline hover:no-underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#0a0a0a] underline hover:no-underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  size="lg"
                  variant="filled"
                  className="w-full rounded-[10px]"
                  disabled={createOrder.isPending || isRazorpayLoading}
                >
                  {createOrder.isPending || isRazorpayLoading
                    ? "Processing..."
                    : watch("paymentMethod") === "RAZORPAY"
                    ? "Proceed to Payment"
                    : "Place Order"}
                </Button>
              </div>
            </div>
          </motion.div>
        </form>
      </section>
    </div>
  );
}
