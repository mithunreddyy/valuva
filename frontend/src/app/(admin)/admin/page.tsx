"use client";

import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import { Order, Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard");
      return response.data.data;
    },
  });

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-full">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.map(
                (order: Order & { user: { email: string } }) => (
                  <tr key={order.id} className="border-b hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono text-sm">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">{order.user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
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
                    <td className="py-3 px-4">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Top Products</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Sold</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data?.topProducts?.map(
                (product: Product & { totalSold: number }) => (
                  <tr key={product.id} className="border-b hover:bg-neutral-50">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.totalSold}</td>
                    <td className="py-3 px-4">
                      {formatPrice(product.basePrice)}
                    </td>
                    <td className="py-3 px-4">
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
  );
}
