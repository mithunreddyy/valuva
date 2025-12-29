"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatOrderStatus } from "@/lib/formatters";
import { formatDate, formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import { Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
}

/**
 * Order Card Component
 * Displays order summary with status, items, and total
 */
export function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "SHIPPED":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "PROCESSING":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Link href={`/dashboard/orders/${order.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Order Number</p>
              <p className="font-mono font-semibold text-lg">
                {order.orderNumber}
              </p>
            </div>
            <Badge
              variant={getStatusColor(order.status) as BadgeProps["variant"]}
            >
              {formatOrderStatus(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Order Items Preview */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {order.items.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0"
              >
                {item.variant.product.images?.[0]?.url ? (
                  <Image
                    src={item.variant.product.images[0].url}
                    alt={item.variant.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-6 w-6 text-neutral-400" />
                  </div>
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="w-16 h-16 rounded-md bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-600">
                +{order.items.length - 4}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Items</span>
              <span className="font-medium">
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Placed on</span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-neutral-600" />
                <span className="text-neutral-600">Tracking:</span>
                <span className="font-mono font-medium">
                  {order.trackingNumber}
                </span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="text-xl font-bold">
              {formatPrice(order.total)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
