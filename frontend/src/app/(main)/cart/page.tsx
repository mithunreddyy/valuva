"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/use-analytics";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const analytics = useAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-6 sm:py-8">
          <Skeleton className="h-8 sm:h-10 w-40 sm:w-48 mb-6 sm:mb-8 rounded-[20px]" />
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-[#fafafa] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-300" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
              Your cart is empty
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Add some items to get started
            </p>
          </div>
          <Link href="/shop" className="inline-block">
            <Button size="sm" variant="filled" className="rounded-[10px]">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
            Shopping Cart
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 sm:gap-5 p-4 sm:p-5 lg:p-6 bg-white border border-[#e5e5e5] rounded-[20px] hover:shadow-md transition-all"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[16px]">
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
                    className="text-sm font-medium tracking-normal text-[#0a0a0a] hover:opacity-70 transition-opacity block mb-1.5 sm:mb-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-neutral-500 font-medium mb-2 sm:mb-3">
                    Size: {item.variant.size} • Color: {item.variant.color}
                  </p>
                  <p className="text-sm sm:text-base font-medium mb-3 sm:mb-4 text-[#0a0a0a]">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center border border-[#e5e5e5] rounded-[16px] overflow-hidden">
                      <button
                        onClick={() =>
                          updateItem.mutate({
                            itemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#fafafa] transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <span className="w-10 sm:w-12 text-center text-sm font-medium text-[#0a0a0a]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItem.mutate({
                            itemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#fafafa] transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                      className="ml-auto w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-[16px]"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="border border-[#e5e5e5] p-5 sm:p-6 lg:p-8 bg-white sticky top-20 lg:top-24 rounded-[20px] shadow-sm">
              <h2 className="text-sm sm:text-base font-medium tracking-normal mb-4 sm:mb-5 border-b border-[#e5e5e5] pb-3 sm:pb-4 text-[#0a0a0a]">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-medium text-neutral-500">
                    Subtotal
                  </span>
                  <span className="font-medium text-[#0a0a0a]">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-medium text-neutral-500">
                    Shipping
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-[#e5e5e5] pt-3 sm:pt-4 flex justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#0a0a0a]">
                    Total
                  </span>
                  <span className="text-base sm:text-lg font-medium text-[#0a0a0a]">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Link href="/checkout" className="block">
                  <Button
                    size="lg"
                    variant="filled"
                    className="w-full rounded-[16px] text-sm sm:text-base"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/shop">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-[16px] text-sm sm:text-base"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
