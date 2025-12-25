"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) {
    return (
      <div className="relative z-10 container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
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
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-neutral-600 mb-6">Add some items to get started</p>
          <Button>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-24 h-24 rounded-md overflow-hidden bg-neutral-100">
                {item.product.image && (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-neutral-600 mt-1">
                  Size: {item.variant.size} • Color: {item.variant.color}
                </p>
                <p className="font-semibold mt-2">{formatPrice(item.price)}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    className="w-8 h-8 border rounded hover:bg-neutral-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="w-8 h-8 border rounded hover:bg-neutral-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatPrice(cart.subtotal)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" size="lg" className="w-full mt-3">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
