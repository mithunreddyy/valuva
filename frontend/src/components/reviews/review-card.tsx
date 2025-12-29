"use client";

import { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import { Star, User, Verified } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewCardProps {
  review: Review;
  showProduct?: boolean;
}

export function ReviewCard({ review, showProduct = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-none text-neutral-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 sm:p-8 hover:border-[#0a0a0a] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium tracking-normal text-[#0a0a0a] truncate">
                  {review.user?.firstName} {review.user?.lastName}
                </p>
                {review.isVerified && (
                  <Verified className="h-4 w-4 text-blue-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
          {review.title && (
            <h4 className="text-base font-medium tracking-normal text-[#0a0a0a] mb-2">
              {review.title}
            </h4>
          )}
        </div>
      </div>

      {/* Review Content */}
      <p className="text-sm text-neutral-600 leading-relaxed font-medium mb-4">
        {review.comment}
      </p>

      {/* Product Info */}
      {showProduct && review.product && (
        <div className="pt-4 border-t border-[#e5e5e5]">
          <p className="text-xs text-neutral-500 font-medium">
            Review for:{" "}
            <span className="text-[#0a0a0a]">{review.product.name}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}

