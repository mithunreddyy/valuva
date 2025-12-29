"use client";

import { UserStats } from "@/types";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Package,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

interface ProfileStatsCardProps {
  stats: UserStats;
  isLoading?: boolean;
}

export function ProfileStatsCard({
  stats,
  isLoading = false,
}: ProfileStatsCardProps) {
  const statItems = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Spent",
      value: formatPrice(stats.totalSpent),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 animate-pulse"
          >
            <div className="h-4 bg-[#e5e5e5] rounded-[8px] w-3/4 mb-4"></div>
            <div className="h-8 bg-[#e5e5e5] rounded-[8px] w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 hover:border-[#0a0a0a] transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center mb-4`}>
              <Icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <p className="text-xs text-neutral-500 font-medium mb-2">
              {item.label}
            </p>
            <p className="text-2xl font-medium tracking-tight text-[#0a0a0a]">
              {item.value}
            </p>
          </motion.div>
        );
      })}
      {stats.averageOrderValue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 hover:border-[#0a0a0a] transition-all duration-300 md:col-span-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-medium mb-2">
                Average Order Value
              </p>
              <p className="text-2xl font-medium tracking-tight text-[#0a0a0a]">
                {formatPrice(stats.averageOrderValue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

