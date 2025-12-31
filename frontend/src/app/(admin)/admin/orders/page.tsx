"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/use-admin";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatPrice } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { Package, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 20,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const updateStatus = useUpdateOrderStatus();

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: string,
    trackingNumber?: string
  ) => {
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: newStatus,
        trackingNumber,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.SHIPPED:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.PROCESSING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const orders = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-4 border-b border-[#e5e5e5] pb-4">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 text-[#0a0a0a] leading-[0.95]">
          Orders Management
        </h1>
        <p className="text-xs text-neutral-400 font-normal">
          Manage and track all orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e5e5e5] p-3 rounded-[12px] mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full rounded-[10px] h-9 text-xs border-[#e5e5e5] focus:border-[#0a0a0a]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={OrderStatus.PROCESSING}>
                Processing
              </SelectItem>
              <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
              <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
              <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-neutral-500 font-normal flex items-center">
            Total: {data?.meta?.total || 0} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[12px]" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#e5e5e5] rounded-[16px]">
          <Package className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-sm font-medium tracking-normal text-neutral-600">
            No orders found
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-[#e5e5e5] rounded-[16px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Order Number
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#e5e5e5] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs font-medium text-[#0a0a0a] hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-600 font-normal">
                        {order.user?.email || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium tracking-normal rounded-[8px] ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-600 font-normal">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-[10px] h-7 text-xs"
                            >
                              View
                            </Button>
                          </Link>
                          {order.status !== OrderStatus.DELIVERED &&
                            order.status !== OrderStatus.CANCELLED && (
                              <Select
                                value={order.status}
                                onValueChange={(newStatus) =>
                                  handleStatusUpdate(order.id, newStatus)
                                }
                              >
                                <SelectTrigger className="h-7 text-xs w-28 rounded-[10px] border-[#e5e5e5]">
                                  <SelectValue />
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
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
