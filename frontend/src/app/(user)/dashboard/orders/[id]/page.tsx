"use client";

import { OrderTracking } from "@/components/orders/order-tracking";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCancelOrder, useOrder } from "@/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { CheckCircle, Package, Truck, XCircle } from "lucide-react";
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
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 rounded-[12px]" />
            <Skeleton className="h-48 w-full rounded-[16px]" />
            <Skeleton className="h-32 w-full rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container-luxury text-center py-12 space-y-4">
          <Package className="h-12 w-12 mx-auto text-neutral-300" />
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight leading-[0.95]">
            Order not found
          </h2>
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/orders")}
            className="rounded-[12px]"
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[0.95]">
                Order Details
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                Order #{order.orderNumber}
              </p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm" className="rounded-[12px]">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-6 sm:py-8">
        <div className="space-y-3">
          {/* Order Status */}
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon()}
              <div>
                <h2 className="text-base font-medium tracking-normal mb-1.5">
                  Order Status
                </h2>
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-medium tracking-normal rounded-[8px] ${
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
            <p className="text-[10px] text-neutral-400 font-normal mb-3">
              Placed on {formatDate(order.createdAt)}
            </p>
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-[12px] h-8 text-xs"
                onClick={handleCancel}
                disabled={cancelOrder.isPending}
              >
                {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-3">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
                <h2 className="text-base font-medium tracking-normal mb-4">
                  Order Items
                </h2>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-3 border-b border-[#e5e5e5] last:border-0"
                    >
                      <div className="relative w-16 h-16 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[10px]">
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
                      <div className="flex-1">
                        <h3 className="text-xs font-medium tracking-normal mb-1">
                          {item.variant.product.name}
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-normal mb-0.5">
                          {item.variant.size} • {item.variant.color}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-normal mb-1.5">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
                <h2 className="text-base font-medium tracking-normal mb-4">
                  Shipping Address
                </h2>
                <div className="text-xs space-y-1.5 font-normal">
                  <p className="text-xs font-medium text-[#0a0a0a] mb-1.5">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {order.shippingAddress.addressLine1}
                  </p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-[10px] text-neutral-400">
                      {order.shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-400">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {order.shippingAddress.country}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-2.5">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Order Tracking */}
              {order.status !== "CANCELLED" && (
                <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
                  <h2 className="text-base font-medium tracking-normal mb-4">
                    Track Order
                  </h2>
                  <OrderTracking orderNumber={order.orderNumber} />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px] sticky top-24">
                <h2 className="text-sm font-medium tracking-normal mb-4 border-b border-[#e5e5e5] pb-3">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-[10px] font-normal text-neutral-400">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[10px] font-normal text-neutral-400">
                        Discount
                      </span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-[10px] font-normal text-neutral-400">
                      Shipping
                    </span>
                    <span className="font-medium">
                      {order.shippingCost === 0
                        ? "Free"
                        : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[10px] font-normal text-neutral-400">
                        Tax
                      </span>
                      <span className="font-medium">
                        {formatPrice(order.tax)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-[#e5e5e5] pt-3 flex justify-between text-sm font-medium">
                  <span className="text-xs">Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                  <h3 className="text-xs font-medium tracking-normal mb-3">
                    Payment
                  </h3>
                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-normal text-neutral-400">
                        Method
                      </span>
                      <span className="font-medium">
                        {order.payment?.method || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-normal text-neutral-400">
                        Status
                      </span>
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
                        <span className="text-[10px] font-normal text-neutral-400">
                          Transaction ID
                        </span>
                        <span className="font-mono text-[10px] font-medium">
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
