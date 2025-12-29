"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Star, Users } from "lucide-react";

interface SocialProofProps {
  recentPurchases?: Array<{
    productName: string;
    customerName: string;
    timeAgo: string;
  }>;
  averageRating?: number;
  totalReviews?: number;
  totalCustomers?: number;
  className?: string;
}

export function SocialProof({
  recentPurchases = [],
  averageRating = 4.5,
  totalReviews = 0,
  totalCustomers = 0,
  className = "",
}: SocialProofProps) {
  // Only show if we have real data - no mock data in production
  const displayPurchases = recentPurchases;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="h-4 w-4 fill-[#0a0a0a] text-[#0a0a0a]" />
            <span className="text-lg font-medium text-[#0a0a0a]">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            {totalReviews} reviews
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="h-4 w-4 text-[#0a0a0a]" />
            <span className="text-lg font-medium text-[#0a0a0a]">
              {totalCustomers.toLocaleString()}+
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">Customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <ShoppingBag className="h-4 w-4 text-[#0a0a0a]" />
            <span className="text-lg font-medium text-[#0a0a0a]">
              {totalCustomers > 0
                ? `${Math.floor(totalCustomers / 1000)}K+`
                : "—"}
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">Orders</p>
        </motion.div>
      </div>

      {/* Recent Purchases - Only show if we have real data */}
      {displayPurchases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-[#fafafa] border border-[#e5e5e5] rounded-[16px] p-4 space-y-3"
        >
          <h3 className="text-sm font-medium text-[#0a0a0a] mb-3">
            Recent Purchases
          </h3>
          <div className="space-y-2">
            {displayPurchases.slice(0, 3).map((purchase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-xs"
              >
                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="text-neutral-600 font-medium">
                  <span className="text-[#0a0a0a] font-semibold">
                    {purchase.customerName}
                  </span>{" "}
                  purchased{" "}
                  <span className="text-[#0a0a0a] font-semibold">
                    {purchase.productName}
                  </span>
                </span>
                <span className="text-neutral-400 ml-auto">
                  {purchase.timeAgo}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
