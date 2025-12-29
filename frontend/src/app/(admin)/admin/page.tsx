"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/hooks/use-admin";
import { formatPrice } from "@/lib/utils";
import { Order, Product } from "@/types";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      value: formatPrice(data?.overview?.totalRevenue || 0),
      icon: DollarSign,
      change: "+12.5%",
    },
    {
      title: "Total Orders",
      value: data?.overview?.totalOrders || 0,
      icon: ShoppingCart,
      change: "+8.2%",
    },
    {
      title: "Total Users",
      value: data?.overview?.totalUsers || 0,
      icon: Users,
      change: "+15.3%",
    },
    {
      title: "Pending Orders",
      value: data?.overview?.pendingOrders || 0,
      icon: Package,
      change: "-3.1%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 border-b border-[#e5e5e5] pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal mb-2 sm:mb-3 text-[#0a0a0a]">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-[#e5e5e5] p-5 sm:p-6 rounded-[12px] sm:rounded-[16px] hover:border-[#0a0a0a] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium tracking-normal text-neutral-500 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0a0a0a] truncate">
                    {stat.value}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 border border-[#e5e5e5] rounded-[8px] sm:rounded-[10px] flex-shrink-0 ml-3">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0a0a0a]" />
                </div>
              </div>
              <p className="text-xs font-medium tracking-normal text-neutral-500">
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-[#e5e5e5] rounded-[12px] sm:rounded-[16px] overflow-hidden mb-6 sm:mb-8 shadow-sm">
          <div className="p-5 sm:p-6 border-b border-[#e5e5e5]">
            <h2 className="text-lg sm:text-xl font-medium tracking-normal text-[#0a0a0a]">
              Recent Orders
            </h2>
          </div>
          <div className="p-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Order ID
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Customer
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Total
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentOrders?.map(
                    (order: Order & { user: { email: string } }) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#e5e5e5] hover:bg-[#fafafa] transition-colors"
                      >
                        <td className="py-4 px-4 font-mono text-sm font-medium">
                          {order.orderNumber}
                        </td>
                        <td className="py-4 px-4 text-sm text-neutral-600">
                          {order.user.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium tracking-normal rounded-[6px] ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-4 px-4 text-sm text-neutral-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-[#e5e5e5] rounded-[12px] sm:rounded-[16px] overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-[#e5e5e5]">
            <h2 className="text-lg sm:text-xl font-medium tracking-normal text-[#0a0a0a]">
              Top Products
            </h2>
          </div>
          <div className="p-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Product
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Sold
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Price
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium tracking-normal">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.topProducts?.map(
                    (product: Product & { totalSold: number }) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#e5e5e5] hover:bg-[#fafafa] transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">
                          {product.name}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {product.totalSold}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {formatPrice(product.basePrice)}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {formatPrice(
                            product.totalSold * Number(product.basePrice)
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
