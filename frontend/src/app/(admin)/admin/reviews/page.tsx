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
import { adminApi } from "@/services/api/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { AxiosError } from "axios";
import { Check, MessageSquare, Search, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", page, searchQuery, approvalFilter],
    queryFn: async () => {
      const response = await adminApi.getReviews({
        page,
        limit: 20,
        isApproved:
          approvalFilter !== "all"
            ? approvalFilter === "approved"
            : undefined,
      });
      return response.data;
    },
  });

  const queryClient = useQueryClient();

  const approveReview = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      adminApi.approveReview(id, isApproved),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({
        title: "Success",
        description: variables.isApproved
          ? "Review approved successfully"
          : "Review rejected successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update review",
        variant: "destructive",
      });
    },
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => adminApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to delete review",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: string) => {
    approveReview.mutate({ id, isApproved: true });
  };

  const handleReject = (id: string) => {
    approveReview.mutate({ id, isApproved: false });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview.mutate(id);
    }
  };

  const reviews = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-[#e5e5e5] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-normal mb-1.5">
              Reviews Management
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Approve, reject, or delete product reviews
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e5e5e5] p-4 rounded-[12px] mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-[10px] h-10 text-sm"
              />
            </div>
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-full rounded-[10px] h-10 text-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-neutral-500 font-medium flex items-center">
              Total: {data?.meta?.total || 0} reviews
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-[12px]" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-sm font-medium text-neutral-600 mb-2">
              No reviews found
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {reviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 hover:border-[#0a0a0a] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#fafafa] border border-[#e5e5e5] rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-[#0a0a0a]">
                              {review.user?.firstName?.[0] || "U"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-[#0a0a0a]">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            {review.isVerified && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-[4px]">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 font-medium mb-2">
                            {review.user?.email}
                          </p>
                          {review.product && (
                            <Link
                              href={`/products/${review.product.slug}`}
                              className="text-xs text-[#0a0a0a] hover:underline font-medium"
                            >
                              {review.product.name}
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? "fill-[#0a0a0a] text-[#0a0a0a]"
                                  : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-neutral-600">
                          {review.rating}/5
                        </span>
                      </div>

                      {review.title && (
                        <p className="text-sm font-medium text-[#0a0a0a] mb-2">
                          {review.title}
                        </p>
                      )}
                      <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-2">
                        {review.comment}
                      </p>
                      <p className="text-xs text-neutral-500 font-medium">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-[6px] ${
                          review.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {!review.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            className="h-8 w-8 p-0 rounded-[8px] text-green-600 hover:text-green-700 hover:bg-green-50"
                            disabled={approveReview.isPending}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {review.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(review.id)}
                            className="h-8 w-8 p-0 rounded-[8px] text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            disabled={approveReview.isPending}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="h-8 w-8 p-0 rounded-[8px] text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deleteReview.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-5 flex justify-center">
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

