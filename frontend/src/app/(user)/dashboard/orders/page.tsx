"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function OrdersPage() {
  const [page] = useState(1);
  const { data, isLoading } = useOrders({ page, limit: 10 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="container-luxury text-center py-16 space-y-6">
          <Package className="h-24 w-24 mx-auto text-neutral-300" />
          <h2 className="text-3xl sm:text-4xl font-medium tracking-normal">
            No orders yet
          </h2>
          <p className="text-sm text-neutral-500 font-medium">
            Start shopping to see your orders here
          </p>
          <Link href="/shop">
            <Button size="lg" className="rounded-[10px]">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
            My Orders
          </h1>
        </div>
      </section>

      {/* Orders List */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block"
            >
              <div className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-all rounded-[12px]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-neutral-500 font-medium mb-1">Order Number</p>
                    <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex gap-3 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] rounded-[8px] flex-shrink-0"
                    >
                      {item.variant.product.images?.[0]?.url ? (
                        <Image
                          src={item.variant.product.images[0].url}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-neutral-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-16 h-16 border border-[#e5e5e5] bg-[#fafafa] rounded-[8px] flex items-center justify-center text-xs text-neutral-600 font-medium">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-medium">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <p className="text-xs text-neutral-500 font-medium">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 font-medium mb-1">Total</p>
                    <p className="text-lg font-medium">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
