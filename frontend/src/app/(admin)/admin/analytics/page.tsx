"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminAnalytics,
  useRevenueTrends,
  useTopProducts,
} from "@/hooks/use-admin";
import { formatPrice } from "@/lib/utils";
import { BarChart, DollarSign, Package, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  });

  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: revenueTrends, isLoading: trendsLoading } = useRevenueTrends({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    groupBy: "day",
  });

  const { data: topProducts, isLoading: productsLoading } = useTopProducts({
    limit: 10,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  if (analyticsLoading || trendsLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(analytics?.data?.totalRevenue || 0),
      icon: DollarSign,
      change: analytics?.data?.revenueChange || "+0%",
    },
    {
      title: "Total Orders",
      value: analytics?.data?.totalOrders || 0,
      icon: Package,
      change: analytics?.data?.ordersChange || "+0%",
    },
    {
      title: "Average Order Value",
      value: formatPrice(analytics?.data?.averageOrderValue || 0),
      icon: TrendingUp,
      change: analytics?.data?.aovChange || "+0%",
    },
    {
      title: "Top Products",
      value: topProducts?.data?.length || 0,
      icon: BarChart,
      change: "View all",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-4 border-b border-[#e5e5e5] pb-4">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 text-[#0a0a0a] leading-[0.95]">
          Analytics Dashboard
        </h1>
        <p className="text-xs text-neutral-400 font-normal">
          View detailed analytics and insights
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white border border-[#e5e5e5] p-4 rounded-[12px] mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-[10px] text-xs focus:border-[#0a0a0a] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-[10px] text-xs focus:border-[#0a0a0a] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-[#e5e5e5] p-4 rounded-[16px] hover:border-[#0a0a0a] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium tracking-normal text-neutral-500 mb-1.5">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-medium text-[#0a0a0a]">
                  {stat.value}
                </p>
              </div>
              <div className="p-2 border border-[#e5e5e5] rounded-[10px]">
                <stat.icon className="h-4 w-4 text-[#0a0a0a]" />
              </div>
            </div>
            <p className="text-xs font-normal text-neutral-500">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Top Products */}
      {topProducts?.data && topProducts.data.length > 0 && (
        <div className="bg-white border border-[#e5e5e5] rounded-[16px] overflow-hidden mb-4">
          <div className="p-4 border-b border-[#e5e5e5]">
            <h2 className="text-base font-medium tracking-normal">
              Top Products
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-2.5">
              {topProducts.data.map(
                (
                  product: {
                    id: string;
                    name: string;
                    totalSold: number;
                    revenue?: number;
                  },
                  index: number
                ) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between pb-2.5 border-b border-[#e5e5e5] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-neutral-500 w-5">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-xs font-medium tracking-normal">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-500 font-normal">
                          {product.totalSold} sold
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-medium">
                      {formatPrice(product.revenue || 0)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Trends */}
      {revenueTrends?.data && revenueTrends.data.length > 0 && (
        <div className="bg-white border border-[#e5e5e5] rounded-[16px] overflow-hidden">
          <div className="p-4 border-b border-[#e5e5e5]">
            <h2 className="text-base font-medium tracking-normal">
              Revenue Trends
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-2.5">
              {revenueTrends.data.map(
                (
                  trend: {
                    date?: string;
                    period?: string;
                    revenue?: number;
                    total?: number;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-2.5 border-b border-[#e5e5e5] last:border-0"
                  >
                    <span className="text-xs font-normal text-neutral-600">
                      {trend.date || trend.period}
                    </span>
                    <span className="text-xs font-medium">
                      {formatPrice(trend.revenue || trend.total || 0)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
