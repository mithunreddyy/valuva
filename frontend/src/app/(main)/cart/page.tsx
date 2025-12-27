"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) {
    return (
      <div className="container-luxury py-16">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const cart = data?.data;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="container-luxury text-center py-16 space-y-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
            Your cart is empty
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            Add some items to get started
          </p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
            Shopping Cart
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-5 bg-white border border-[#e5e5e5] rounded-[12px]"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[8px]">
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
                    className="text-sm font-medium tracking-normal hover-opacity transition-opacity block mb-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-neutral-500 font-medium mb-3">
                    Size: {item.variant.size} • Color: {item.variant.color}
                  </p>
                  <p className="text-base font-medium mb-4">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateItem.mutate({
                          itemId: item.id,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                      className="w-9 h-9 border border-[#e5e5e5] flex items-center justify-center hover:border-[#0a0a0a] transition-all rounded-[8px]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateItem.mutate({
                          itemId: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="w-9 h-9 border border-[#e5e5e5] flex items-center justify-center hover:border-[#0a0a0a] transition-all rounded-[8px]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      className="ml-auto text-neutral-400 hover:text-red-600 transition-colors p-2 rounded-[8px]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="border border-[#e5e5e5] p-6 bg-white sticky top-24 rounded-[12px]">
              <h2 className="text-sm font-medium tracking-normal mb-5 border-b border-[#e5e5e5] pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-medium text-neutral-600">
                    Subtotal
                  </span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-medium text-neutral-600">
                    Shipping
                  </span>
                  <span className="text-xs font-medium">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-[#e5e5e5] pt-4 flex justify-between text-lg">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block mb-3">
                <Button size="lg" variant="filled" className="w-full rounded-[10px]">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <Button size="lg" variant="outline" className="w-full rounded-[10px]">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
