"use client";

import { OrderTracking } from "@/components/orders/order-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateOrderStatus,
  useUpdateOrderTracking,
} from "@/hooks/use-admin";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderItem, OrderStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [trackingStatus, setTrackingStatus] = useState("");
  const [trackingLocation, setTrackingLocation] = useState("");
  const [trackingDescription, setTrackingDescription] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/orders/${orderId}`);
      return response.data.data;
    },
  });

  const updateStatus = useUpdateOrderStatus();
  const updateTracking = useUpdateOrderTracking();

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: newStatus,
      });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleAddTrackingUpdate = async () => {
    if (!trackingStatus || !trackingLocation || !trackingDescription) {
      toast({
        title: "Error",
        description: "Please fill all tracking fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateTracking.mutateAsync({
        orderId,
        status: trackingStatus,
        location: trackingLocation,
        description: trackingDescription,
      });
      toast({
        title: "Success",
        description: "Tracking update added successfully",
      });
      setTrackingStatus("");
      setTrackingLocation("");
      setTrackingDescription("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to add tracking update",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
        <p className="text-base font-medium tracking-normal text-neutral-600">
          Order not found
        </p>
      </div>
    );
  }

  const order = data;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-[#e5e5e5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 leading-[0.95]">
            Order Details
          </h1>
          <p className="text-xs text-neutral-400 font-normal">
            Order #{order.orderNumber}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-[12px] border-[#e5e5e5] hover:border-[#0a0a0a]"
          onClick={() => router.push("/admin/orders")}
        >
          Back to Orders
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Status */}
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
            <h2 className="text-sm font-medium tracking-normal mb-3">
                Order Status
              </h2>
              <div className="flex items-center gap-4">
                <Select value={order.status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger className="w-48 rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.PROCESSING}>
                      Processing
                    </SelectItem>
                    <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>
                      Delivered
                    </SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-neutral-500 font-normal">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

          {/* Order Items */}
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
            <h2 className="text-sm font-medium tracking-normal mb-3">
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items?.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-3 border-b border-[#e5e5e5] last:border-0"
                >
                  <div className="relative w-16 h-16 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[10px]">
                    {item.variant?.product?.images?.[0]?.url && (
                      <Image
                        src={item.variant.product.images[0].url}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-medium tracking-normal mb-1">
                      {item.variant?.product?.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-normal mb-0.5">
                      {item.variant?.size} • {item.variant?.color}
                    </p>
                    <p className="text-xs text-neutral-500 font-normal mb-1.5">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs font-medium">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
            <h2 className="text-sm font-medium tracking-normal mb-3">
              Shipping Address
            </h2>
            <div className="text-xs space-y-1 font-normal">
              <p className="text-xs font-medium text-[#0a0a0a] mb-1.5">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-xs text-neutral-600">
                {order.shippingAddress?.addressLine1}
              </p>
              {order.shippingAddress?.addressLine2 && (
                <p className="text-xs text-neutral-600">
                  {order.shippingAddress.addressLine2}
                </p>
              )}
              <p className="text-xs text-neutral-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p className="text-xs text-neutral-600">
                {order.shippingAddress?.country}
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
            <h2 className="text-sm font-medium tracking-normal mb-3">
              Order Tracking
            </h2>
            <OrderTracking orderNumber={order.orderNumber} />
          </div>

          {/* Add Tracking Update */}
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px]">
            <h2 className="text-sm font-medium tracking-normal mb-3">
              Add Tracking Update
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Status
                </label>
                <Select
                  value={trackingStatus}
                  onValueChange={setTrackingStatus}
                >
                  <SelectTrigger className="w-full rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PROCESSING}>
                      Processing
                    </SelectItem>
                    <SelectItem value={OrderStatus.SHIPPED}>
                      Shipped
                    </SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>
                      Delivered
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Location
                </label>
                <Input
                  type="text"
                  value={trackingLocation}
                  onChange={(e) => setTrackingLocation(e.target.value)}
                  placeholder="Current location"
                  className="rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[#0a0a0a]">
                  Description
                </label>
                <Textarea
                  value={trackingDescription}
                  onChange={(e) => setTrackingDescription(e.target.value)}
                  placeholder="Update description"
                  className="rounded-[10px] min-h-[80px] text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
                />
              </div>
              <Button
                onClick={handleAddTrackingUpdate}
                disabled={updateTracking.isPending}
                variant="filled"
                size="sm"
                className="w-full rounded-[12px]"
              >
                {updateTracking.isPending
                  ? "Adding..."
                  : "Add Tracking Update"}
              </Button>
            </div>
          </div>
          </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px] sticky top-24">
            <h2 className="text-sm font-medium tracking-normal mb-3 border-b border-[#e5e5e5] pb-3">
              Order Summary
            </h2>
            <div className="space-y-2.5 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-xs font-normal text-neutral-500">
                  Subtotal
                </span>
                <span className="font-medium">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-xs font-normal text-neutral-500">
                    Discount
                  </span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-xs font-normal text-neutral-500">
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
                  <span className="text-xs font-normal text-neutral-500">
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
              <h3 className="text-xs font-medium tracking-normal mb-2.5">
                Payment
              </h3>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs font-normal text-neutral-500">
                    Method
                  </span>
                  <span className="font-medium">
                    {order.payment?.method || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-normal text-neutral-500">
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
                    {order.payment?.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
