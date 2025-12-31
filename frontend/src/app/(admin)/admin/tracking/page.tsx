"use client";

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
import { useActiveOrders, useAddTrackingUpdate } from "@/hooks/use-admin";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { Truck } from "lucide-react";
import { useState } from "react";

export default function AdminTrackingPage() {
  const { data, isLoading } = useActiveOrders();
  const addTrackingUpdate = useAddTrackingUpdate();

  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const orders = data?.data || [];

  const handleAddUpdate = async () => {
    if (!selectedOrder || !status || !location || !description) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTrackingUpdate.mutateAsync({
        orderId: selectedOrder,
        status,
        location,
        description,
      });
      toast({
        title: "Success",
        description: "Tracking update added successfully",
      });
      setStatus("");
      setLocation("");
      setDescription("");
      setSelectedOrder("");
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
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12 lg:py-16">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-8 border-b border-[#e5e5e5] pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal mb-3">
            Order Tracking Management
          </h1>
          <p className="text-sm text-neutral-500 font-medium tracking-normal">
            Update tracking information for active orders
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Orders */}
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
            <div className="p-6 border-b border-[#e5e5e5]">
              <h2 className="text-xl font-medium tracking-normal">
                Active Orders
              </h2>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
                  <p className="text-base font-medium tracking-normal text-neutral-600">
                    No active orders
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="p-4 border border-[#e5e5e5] rounded-[10px] hover:border-[#0a0a0a] transition-all cursor-pointer"
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium tracking-normal">
                          {order.orderNumber}
                        </p>
                        <span
                          className={`px-3 py-1 text-xs font-medium tracking-normal rounded-[6px] ${
                            order.status === OrderStatus.SHIPPED
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Tracking Update */}
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
            <div className="p-6 border-b border-[#e5e5e5]">
              <h2 className="text-xl font-medium tracking-normal">
                Add Tracking Update
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Order
                </label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger className="w-full rounded-[10px]">
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order: Order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.orderNumber} - {order.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full rounded-[10px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PROCESSING}>
                      Processing
                    </SelectItem>
                    <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>
                      Delivered
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Current location"
                  className="rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Update description"
                  className="rounded-[10px] min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleAddUpdate}
                disabled={addTrackingUpdate.isPending || !selectedOrder}
                className="w-full rounded-[10px]"
              >
                {addTrackingUpdate.isPending
                  ? "Adding..."
                  : "Add Tracking Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
