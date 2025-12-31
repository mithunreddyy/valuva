"use client";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
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
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
    control,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  // Use useWatch instead of watch() for React Compiler compatibility
  const shippingAddressId = useWatch({ control, name: "shippingAddressId" });
  const billingAddressId = useWatch({ control, name: "billingAddressId" });
  const paymentMethod = useWatch({ control, name: "paymentMethod" });

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
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cartData?.data || cartData.data.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="container-luxury text-center space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#0a0a0a]">
            Your cart is empty
          </h1>
          <Button
            onClick={() => router.push("/shop")}
            size="sm"
            variant="filled"
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

  // Determine current step based on form state
  const getCurrentStep = (): "BAG" | "ADDRESS" | "PAYMENT" => {
    if (!shippingAddressId || !billingAddressId) {
      return "ADDRESS";
    }
    return "PAYMENT";
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Cart", url: "/cart" },
            { name: "Checkout", url: "/checkout", isBold: true },
          ]}
        />
      </div>

      {/* Progress Indicator */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-3 sm:py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* BAG Step */}
            <div className="flex flex-col items-center">
              <span
                className={`text-xs font-medium tracking-normal ${
                  currentStep === "BAG" ? "text-[#0a0a0a]" : "text-neutral-400"
                }`}
              >
                Bag
              </span>
              {currentStep === "BAG" && (
                <div className="w-full h-0.5 bg-[#0a0a0a] mt-1" />
              )}
            </div>

            {/* Connector Line 1 */}
            <div
              className="h-px border-t border-dashed border-[#e5e5e5]"
              style={{ width: "60px", maxWidth: "100px" }}
            />

            {/* ADDRESS Step */}
            <div className="flex flex-col items-center">
              <span
                className={`text-xs font-medium tracking-normal ${
                  currentStep === "ADDRESS"
                    ? "text-[#0a0a0a]"
                    : "text-neutral-400"
                }`}
              >
                Address
              </span>
              {currentStep === "ADDRESS" && (
                <div className="w-full h-0.5 bg-[#0a0a0a] mt-1" />
              )}
            </div>

            {/* Connector Line 2 */}
            <div
              className="h-px border-t border-dashed border-[#e5e5e5]"
              style={{ width: "60px", maxWidth: "100px" }}
            />

            {/* PAYMENT Step */}
            <div className="flex flex-col items-center">
              <span
                className={`text-xs font-medium tracking-normal ${
                  currentStep === "PAYMENT"
                    ? "text-[#0a0a0a]"
                    : "text-neutral-400"
                }`}
              >
                Payment
              </span>
              {currentStep === "PAYMENT" && (
                <div className="w-full h-0.5 bg-[#0a0a0a] mt-1" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
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
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-12 gap-4 lg:gap-6"
          >
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-3">
              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white border border-[#e5e5e5] p-5 rounded-[16px]"
              >
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Shipping Address
                </h2>

                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-neutral-400 font-normal mb-3">
                      No addresses found. Please add one.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/dashboard/addresses")}
                      className="border-[#e5e5e5] hover:border-[#0a0a0a] bg-white rounded-[12px]"
                    >
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 p-3 border cursor-pointer transition-all rounded-[12px] ${
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
                          <p className="text-sm font-normal tracking-normal mb-1.5">
                            {address.fullName}
                          </p>
                          <p className="text-xs text-neutral-400 font-normal">
                            {address.addressLine1}
                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}
                          </p>
                          <p className="text-xs text-neutral-400 font-normal">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-xs text-neutral-400 font-normal">
                            {address.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {errors.shippingAddressId && (
                  <p className="text-red-600 text-[10px] mt-2 font-normal">
                    {errors.shippingAddressId.message}
                  </p>
                )}
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white border border-[#e5e5e5] p-5 rounded-[16px]"
              >
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Billing Address
                </h2>
                <div className="space-y-2.5">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-3 border cursor-pointer transition-all rounded-[12px] ${
                        billingAddressId === address.id
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
                        <p className="text-sm font-normal tracking-normal mb-1.5">
                          {address.fullName}
                        </p>
                        <p className="text-xs text-neutral-400 font-normal">
                          {address.addressLine1}
                        </p>
                        <p className="text-xs text-neutral-400 font-normal">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.billingAddressId && (
                  <p className="text-red-600 text-[10px] mt-2 font-normal">
                    {errors.billingAddressId.message}
                  </p>
                )}
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white border border-[#e5e5e5] p-5 rounded-[16px]"
              >
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Payment Method
                </h2>
                <div className="space-y-2">
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
                      className={`flex items-center gap-3 p-3 border cursor-pointer transition-all rounded-[12px] ${
                        paymentMethod === method.value ||
                        (method.value === "COD" && paymentMethod === "RAZORPAY")
                          ? "border-[#0a0a0a] bg-[#fafafa]"
                          : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value={method.value}
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-xs font-normal tracking-normal">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.25,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white border border-[#e5e5e5] p-5 rounded-[16px]"
              >
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Order Notes (Optional)
                </h2>
                <Textarea
                  {...register("notes")}
                  className="min-h-[80px] rounded-[12px] border-[#e5e5e5] bg-white focus:border-[#0a0a0a] text-xs font-normal"
                  placeholder="Any special instructions for your order?"
                />
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white border border-[#e5e5e5] p-5 rounded-[16px] sticky top-24"
              >
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3 text-[#0a0a0a]">
                  Order Summary
                </h2>

                <div className="space-y-2.5 mb-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-2.5 border-b border-[#e5e5e5] last:border-0"
                    >
                      <div className="relative w-14 h-14 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[10px]">
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
                        <p className="text-xs font-normal tracking-normal line-clamp-1 mb-0.5">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-neutral-400 font-normal mb-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-normal">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4 border-t border-[#e5e5e5] pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-xs font-normal text-neutral-400">
                      Subtotal
                    </span>
                    <span className="font-normal text-[#0a0a0a]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-xs font-normal text-neutral-400">
                      Shipping
                    </span>
                    <span className="text-xs font-normal text-neutral-400">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-[#e5e5e5] pt-2.5 flex justify-between">
                    <span className="text-sm font-medium text-[#0a0a0a]">
                      Total
                    </span>
                    <span className="text-base font-medium text-[#0a0a0a]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 font-normal text-center mb-4 leading-relaxed">
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
                  size="sm"
                  variant="filled"
                  className="w-full rounded-[12px]"
                  disabled={createOrder.isPending || isRazorpayLoading}
                >
                  {createOrder.isPending || isRazorpayLoading
                    ? "Processing..."
                    : paymentMethod === "RAZORPAY"
                    ? "Proceed to Payment"
                    : "Place Order"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </form>
      </section>
    </div>
  );
}
