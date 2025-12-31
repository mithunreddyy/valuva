"use client";

import { CouponFormModal } from "@/components/admin/coupon-form-modal";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { adminApi } from "@/services/api/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Calendar, Edit, Plus, Search, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons", page, searchQuery, statusFilter],
    queryFn: async () => {
      const response = await adminApi.getCoupons({
        page,
        limit: 20,
        search: searchQuery || undefined,
        isActive: statusFilter !== "all" ? statusFilter : undefined,
      });
      return response.data;
    },
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => adminApi.toggleCouponStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({
        title: "Success",
        description: "Coupon status updated",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update coupon",
        variant: "destructive",
      });
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to delete coupon",
        variant: "destructive",
      });
    },
  });
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon.mutate(id);
    }
  };

  const coupons = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-[#e5e5e5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 text-[#0a0a0a] leading-[0.95]">
            Coupons Management
          </h1>
          <p className="text-xs text-neutral-400 font-normal">
            Create and manage discount coupons
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          size="sm"
          variant="filled"
          className="rounded-[12px] gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Coupon
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e5e5e5] p-3 rounded-[12px] mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search coupons..."
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
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-neutral-500 font-normal flex items-center">
            Total: {data?.meta?.total || 0} coupons
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[12px]" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#e5e5e5] rounded-[16px]">
          <Ticket className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600 mb-2">
            No coupons found
          </p>
          <p className="text-xs text-neutral-500 font-normal">
            Create your first coupon to get started
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
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Discount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Usage
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Valid Until
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium tracking-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon: Coupon) => {
                    const isExpired = new Date(coupon.expiresAt) < new Date();
                    const discountText =
                      coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : formatPrice(coupon.discountValue);
                    return (
                      <tr
                        key={coupon.id}
                        className="border-b border-[#e5e5e5] hover:bg-[#fafafa] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-xs font-mono font-medium text-[#0a0a0a]">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-neutral-600 font-normal">
                            {coupon.description || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-[#0a0a0a]">
                            {discountText}
                          </span>
                          {coupon.maxDiscount && (
                            <span className="text-xs text-neutral-500 block font-normal">
                              Max: {formatPrice(coupon.maxDiscount)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-neutral-600">
                            {coupon.usageCount}
                            {coupon.usageLimit
                              ? ` / ${coupon.usageLimit}`
                              : ""}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-normal">
                              {new Date(
                                coupon.expiresAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {isExpired && (
                            <span className="text-xs text-red-600 font-normal block mt-1">
                              Expired
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={coupon.isActive && !isExpired}
                              onCheckedChange={() =>
                                toggleStatus.mutate(coupon.id)
                              }
                              disabled={toggleStatus.isPending || isExpired}
                              className="data-[state=checked]:bg-[#0a0a0a]"
                            />
                            <span
                              className={`text-xs font-normal ${
                                coupon.isActive && !isExpired
                                  ? "text-green-600"
                                  : "text-neutral-500"
                              }`}
                            >
                              {coupon.isActive && !isExpired
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCoupon(coupon)}
                              className="h-7 w-7 p-0 rounded-[8px]"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(coupon.id)}
                              className="h-7 w-7 p-0 rounded-[8px] text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deleteCoupon.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

        {/* Form Modal */}
        {isFormOpen && (
          <CouponFormModal
            coupon={editingCoupon}
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
