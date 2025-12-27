"use client";

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
    } catch (error) {
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
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12 lg:py-16">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-8 border-b border-[#e5e5e5] pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal mb-3">
            Orders Management
          </h1>
          <p className="text-sm text-neutral-500 font-medium tracking-normal">
            Manage and track all orders
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-[10px]">
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
            <div className="text-sm text-neutral-500 font-medium flex items-center">
              Total: {data?.meta?.total || 0} orders
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <Package className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
            <p className="text-base font-medium tracking-normal text-neutral-600">
              No orders found
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Order Number
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Total
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium tracking-normal">
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
                        <td className="py-4 px-6">
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-medium text-[#0a0a0a] hover:underline"
                          >
                            {order.orderNumber}
                          </a>
                        </td>
                        <td className="py-4 px-6 text-sm text-neutral-600">
                          {order.user?.email || "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-xs font-medium tracking-normal rounded-[6px] ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-4 px-6 text-sm text-neutral-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/admin/orders/${order.id}`}
                              className="text-xs font-medium text-[#0a0a0a] hover:underline"
                            >
                              View
                            </a>
                            {order.status !== OrderStatus.DELIVERED &&
                              order.status !== OrderStatus.CANCELLED && (
                                <Select
                                  value={order.status}
                                  onValueChange={(newStatus) =>
                                    handleStatusUpdate(order.id, newStatus)
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs w-32 rounded-[8px]">
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
              <div className="mt-6 flex justify-center">
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
    </div>
  );
}
