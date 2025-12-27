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
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12 lg:py-16">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-8 border-b border-[#e5e5e5] pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-neutral-500 font-medium tracking-normal">
            View detailed analytics and insights
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#e5e5e5] rounded-[10px] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#e5e5e5] rounded-[10px] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] hover:border-[#0a0a0a] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium tracking-normal text-neutral-500 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-medium">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 border border-[#e5e5e5] rounded-[8px]">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs font-medium tracking-normal text-neutral-500">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Top Products */}
        {topProducts?.data && topProducts.data.length > 0 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden mb-8">
            <div className="p-6 border-b border-[#e5e5e5]">
              <h2 className="text-xl font-medium tracking-normal">
                Top Products
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
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
                      className="flex items-center justify-between pb-4 border-b border-[#e5e5e5] last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-neutral-500 w-6">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium tracking-normal">
                            {product.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {product.totalSold} sold
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
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
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
            <div className="p-6 border-b border-[#e5e5e5]">
              <h2 className="text-xl font-medium tracking-normal">
                Revenue Trends
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
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
                      className="flex items-center justify-between pb-3 border-b border-[#e5e5e5] last:border-0"
                    >
                      <span className="text-sm font-medium text-neutral-600">
                        {trend.date || trend.period}
                      </span>
                      <span className="text-sm font-medium">
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
