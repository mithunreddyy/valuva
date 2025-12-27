"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAddresses } from "@/hooks/use-addresses";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Please select a shipping address"),
  billingAddressId: z.string().min(1, "Please select a billing address"),
  paymentMethod: z.enum(["COD", "UPI", "CREDIT_CARD", "DEBIT_CARD"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const createOrder = useCreateOrder();

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
        <div className="container-luxury text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-normal">
            Your cart is empty
          </h1>
          <Button
            onClick={() => router.push("/shop")}
            size="lg"
            className="rounded-[10px]"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const cart = cartData.data;
  const addresses = addressesData?.data || [];

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const order = await createOrder.mutateAsync(data);
      router.push(`/dashboard/orders/${order.data.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
            Checkout
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-8 sm:py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                <h2 className="text-xl font-medium tracking-normal mb-6 border-b border-[#e5e5e5] pb-4">
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
                            {address.addressLine2 && `, ${address.addressLine2}`}
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
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                <h2 className="text-xl font-medium tracking-normal mb-6 border-b border-[#e5e5e5] pb-4">
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
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                <h2 className="text-xl font-medium tracking-normal mb-6 border-b border-[#e5e5e5] pb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
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
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                <h2 className="text-xl font-medium tracking-normal mb-6 border-b border-[#e5e5e5] pb-4">
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
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] sticky top-24">
                <h2 className="text-sm font-medium tracking-normal mb-6 border-b border-[#e5e5e5] pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
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

                <div className="space-y-3 mb-6 border-t border-[#e5e5e5] pt-4">
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

                <Button
                  type="submit"
                  size="lg"
                  variant="filled"
                  className="w-full rounded-[10px]"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
