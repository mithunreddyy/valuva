"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OrdersPage() {
  const [page] = useState(1);
  const { data, isLoading } = useOrders({ page, limit: 10 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-neutral-600 mb-6">
          Start shopping to see your orders here
        </p>
        <Button>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/dashboard/orders/${order.id}`}
            className="block"
          >
            <div className="glass rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-neutral-600">Order Number</p>
                  <p className="font-mono font-medium">{order.orderNumber}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
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

              <div className="flex gap-4 mb-4">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="w-16 h-16 rounded bg-neutral-100">
                    {/* Image placeholder */}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-16 h-16 rounded bg-neutral-100 flex items-center justify-center text-sm text-neutral-600">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">Total</p>
                  <p className="text-xl font-bold">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
