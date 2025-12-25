"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder, useCancelOrder } from "@/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data, isLoading } = useOrder(orderId);
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <Button onClick={() => router.push("/dashboard/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const order = data.data;

  const handleCancel = async () => {
    if (
      confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      try {
        await cancelOrder.mutateAsync(orderId);
        router.push("/dashboard/orders");
      } catch (error) {
        console.error("Cancel error:", error);
      }
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-neutral-600 mt-1">
            Order #{order.orderNumber}
          </p>
        </div>
        <Link href="/dashboard/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>

      {/* Order Status */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon()}
          <div>
            <h2 className="text-xl font-semibold">Order Status</h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor()}`}
            >
              {order.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-600">
          Placed on {formatDate(order.createdAt)}
        </p>
        {order.status !== "CANCELLED" &&
          order.status !== "DELIVERED" && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
            >
              {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <div className="w-20 h-20 rounded bg-neutral-100 flex-shrink-0">
                    {/* Product image placeholder */}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.variant.product.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {item.variant.size} • {item.variant.color}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-medium mt-2">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm text-neutral-600 space-y-1">
              <p className="font-medium text-black">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span>
                  {order.shippingCost === 0
                    ? "Free"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Payment</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Method</span>
                  <span>{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status</span>
                  <span
                    className={
                      order.payment.status === "COMPLETED"
                        ? "text-green-600"
                        : order.payment.status === "FAILED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.payment.status}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Transaction ID</span>
                    <span className="font-mono text-xs">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

