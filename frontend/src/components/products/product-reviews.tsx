"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useProductReviews, useCreateReview } from "@/hooks/use-reviews";
import { useAppSelector } from "@/store";
import { Star, User } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useProductReviews(productId);
  const createReview = useCreateReview();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const reviews = data?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a review comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReview.mutateAsync({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });
      setShowForm(false);
      setTitle("");
      setComment("");
      setRating(5);
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#e5e5e5] p-6 lg:p-8 rounded-[20px] animate-pulse">
            <div className="h-4 bg-[#e5e5e5] w-1/4 rounded-[8px] mb-2"></div>
            <div className="h-4 bg-[#e5e5e5] w-1/2 rounded-[8px] mb-4"></div>
            <div className="h-20 bg-[#e5e5e5] rounded-[12px]"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-medium tracking-normal mb-2">
            Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <
                      Math.round(
                        reviews.reduce((acc, r) => acc + r.rating, 0) /
                          reviews.length
                      )
                        ? "fill-[#0a0a0a] text-[#0a0a0a]"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-500 font-medium">
                {(
                  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                ).toFixed(1)}{" "}
                out of 5
              </span>
            </div>
          )}
        </div>
        {isAuthenticated && !showForm && (
          <Button
            variant="outline"
            onClick={() => setShowForm(true)}
            className="rounded-[16px]"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {isAuthenticated && showForm && (
        <div className="bg-white border border-[#e5e5e5] p-6 lg:p-8 rounded-[20px]">
          <h4 className="text-lg font-medium tracking-normal mb-6 text-[#0a0a0a]">
            Write a Review
          </h4>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-3 text-[#0a0a0a]">
                Rating
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        i < rating
                          ? "fill-[#0a0a0a] text-[#0a0a0a]"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-[#0a0a0a]">
                Title (optional)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Review title"
                className="rounded-[16px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-[#0a0a0a]">
                Review
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={4}
                className="rounded-[16px]"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="filled"
                disabled={createReview.isPending}
                className="rounded-[16px]"
              >
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setTitle("");
                  setComment("");
                  setRating(5);
                }}
                className="rounded-[16px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#e5e5e5] rounded-[20px]">
          <p className="text-sm text-neutral-500 font-medium">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-[#e5e5e5] p-6 lg:p-8 rounded-[20px] transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium tracking-normal text-[#0a0a0a]">
                      {review.user?.firstName || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="flex items-center">
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
                      <span className="text-xs text-neutral-500 font-medium">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {review.title && (
                <h5 className="text-sm font-medium tracking-normal mb-3 text-[#0a0a0a]">
                  {review.title}
                </h5>
              )}
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

