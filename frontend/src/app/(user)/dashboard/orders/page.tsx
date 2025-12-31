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
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 rounded-[12px]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[16px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container-luxury text-center py-12 space-y-4">
          <Package className="h-12 w-12 mx-auto text-neutral-300" />
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight leading-[0.95]">
            No orders yet
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Start shopping to see your orders here
          </p>
          <Link href="/shop">
            <Button size="sm" className="rounded-[12px]">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[0.95]">
            My Orders
          </h1>
        </div>
      </section>

      {/* Orders List */}
      <section className="container-luxury py-6 sm:py-8">
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block"
            >
              <div className="bg-white border border-[#e5e5e5] p-4 hover:border-[#0a0a0a] transition-all rounded-[16px]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-normal mb-0.5">Order Number</p>
                    <p className="font-mono text-xs font-medium">{order.orderNumber}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium ${
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

                <div className="flex gap-2.5 mb-3">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-14 h-14 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] rounded-[10px] flex-shrink-0"
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
                          <Package className="h-5 w-5 text-neutral-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-14 h-14 border border-[#e5e5e5] bg-[#fafafa] rounded-[10px] flex items-center justify-center text-[10px] text-neutral-400 font-normal">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-600 font-normal">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-normal">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 font-normal mb-0.5">Total</p>
                    <p className="text-base font-medium">
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
