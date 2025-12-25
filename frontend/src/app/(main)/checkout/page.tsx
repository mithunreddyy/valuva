"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAddresses } from "@/hooks/use-addresses";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { isAuthenticated } = useAuthStore();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const createOrder = useCreateOrder();

  const [showAddressForm, setShowAddressForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
    },
  });

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

  if (cartLoading || addressesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cartData?.data || cartData.data.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push("/shop")}>
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
    <div className="relative z-10 container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  {showAddressForm ? "Cancel" : "Add New"}
                </Button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-neutral-600">
                  No addresses found. Please add one.
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-neutral-50"
                    >
                      <input
                        type="radio"
                        {...register("shippingAddressId")}
                        value={address.id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{address.fullName}</p>
                        <p className="text-sm text-neutral-600">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {address.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {errors.shippingAddressId && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.shippingAddressId.message}
                </p>
              )}
            </div>

            {/* Billing Address */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const shippingId = document.querySelector<HTMLInputElement>(
                      'input[name="shippingAddressId"]:checked'
                    )?.value;
                    if (e.target.checked && shippingId) {
                      setValue("billingAddressId", shippingId);
                    }
                  }}
                />
                <span className="text-sm">Same as shipping address</span>
              </label>

              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <input
                      type="radio"
                      {...register("billingAddressId")}
                      value={address.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-neutral-600">
                        {address.addressLine1}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: "COD", label: "Cash on Delivery" },
                  { value: "UPI", label: "UPI" },
                  { value: "CREDIT_CARD", label: "Credit Card" },
                  { value: "DEBIT_CARD", label: "Debit Card" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <input
                      type="radio"
                      {...register("paymentMethod")}
                      value={method.value}
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                {...register("notes")}
                className="w-full border rounded-md p-3 min-h-[100px]"
                placeholder="Any special instructions for your order?"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded bg-neutral-100"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-neutral-600">
                        {item.variant.size} • {item.variant.color}
                      </p>
                      <p className="text-sm">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
