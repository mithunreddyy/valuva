"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderTracking } from "@/components/orders/order-tracking";
import { useOrder, useCancelOrder } from "@/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
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
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="container-luxury text-center py-16 space-y-6">
          <Package className="h-24 w-24 mx-auto text-neutral-300" />
          <h2 className="text-3xl sm:text-4xl font-medium tracking-normal">
            Order not found
          </h2>
          <Button
            size="lg"
            onClick={() => router.push("/dashboard/orders")}
            className="rounded-[10px]"
          >
            Back to Orders
          </Button>
        </div>
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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
                Order Details
              </h1>
              <p className="text-sm text-neutral-500 font-medium">
                Order #{order.orderNumber}
              </p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="lg" className="rounded-[10px]">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon()}
              <div>
                <h2 className="text-xl font-medium tracking-normal mb-2">Order Status</h2>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium tracking-normal rounded-[6px] ${
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
            </div>
            <p className="text-xs text-neutral-500 font-medium mb-4">
              Placed on {formatDate(order.createdAt)}
            </p>
            {order.status !== "CANCELLED" &&
              order.status !== "DELIVERED" && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-[10px]"
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
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                <h2 className="text-xl font-medium tracking-normal mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-[#e5e5e5] last:border-0"
                    >
                      <div className="relative w-20 h-20 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[8px]">
                        {item.variant.product.images?.[0]?.url ? (
                          <Image
                            src={item.variant.product.images[0].url}
                            alt={item.variant.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium tracking-normal mb-1">
                          {item.variant.product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mb-1">
                          {item.variant.size} • {item.variant.color}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-base font-medium">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                <h2 className="text-xl font-medium tracking-normal mb-6">Shipping Address</h2>
                <div className="text-sm space-y-2 font-medium">
                  <p className="text-sm font-medium text-[#0a0a0a] mb-2">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-xs text-neutral-600">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-xs text-neutral-600">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-xs text-neutral-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-xs text-neutral-600">{order.shippingAddress.country}</p>
                  <p className="text-xs text-neutral-600 mt-3">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Tracking */}
              {order.status !== "CANCELLED" && (
                <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
                  <h2 className="text-xl font-medium tracking-normal mb-6">Track Order</h2>
                  <OrderTracking orderNumber={order.orderNumber} />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] sticky top-24">
                <h2 className="text-sm font-medium tracking-normal mb-6 border-b border-[#e5e5e5] pb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-xs font-medium text-neutral-500">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-xs font-medium text-neutral-500">Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-xs font-medium text-neutral-500">Shipping</span>
                    <span className="font-medium">
                      {order.shippingCost === 0
                        ? "Free"
                        : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-xs font-medium text-neutral-500">Tax</span>
                      <span className="font-medium">{formatPrice(order.tax)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-[#e5e5e5] pt-4 flex justify-between text-lg font-medium">
                  <span className="text-sm">Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
                  <h3 className="text-sm font-medium tracking-normal mb-4">Payment</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-neutral-500">Method</span>
                      <span className="font-medium">{order.payment?.method || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-neutral-500">Status</span>
                      <span
                        className={`font-medium ${
                          order.payment?.status === "COMPLETED"
                            ? "text-green-600"
                            : order.payment?.status === "FAILED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.payment?.status || "PENDING"}
                      </span>
                    </div>
                    {order.payment?.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-neutral-500">Transaction ID</span>
                        <span className="font-mono text-xs font-medium">
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
      </section>
    </div>
  );
}
