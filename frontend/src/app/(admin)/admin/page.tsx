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
    <div className="py-32 md:py-40">
      <div className="container-poster-dashboard">
        <div className="mb-20 border-b-2 border-black pb-8">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.05em] uppercase mb-4 leading-[0.9]">
            DASHBOARD
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] font-black text-neutral-500">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="border-2 border-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] font-black text-neutral-500 mb-2">{stat.title}</p>
                  <p className="text-3xl md:text-4xl font-black">{stat.value}</p>
                </div>
                <div className="p-4 border-2 border-black">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] font-black text-neutral-500">
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="border-2 border-black mb-12">
          <div className="p-8 border-b-2 border-black">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[-0.05em] leading-[0.9]">RECENT ORDERS</h2>
          </div>
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">ORDER ID</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">CUSTOMER</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">STATUS</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">TOTAL</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">DATE</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map(
                  (order: Order & { user: { email: string } }) => (
                    <tr key={order.id} className="border-b border-black hover:bg-black hover:text-white transition-all">
                      <td className="py-4 px-4 font-mono text-sm font-black">
                        {order.orderNumber}
                      </td>
                      <td className="py-4 px-4 text-sm">{order.user.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 border-2 border-black text-xs uppercase tracking-[0.2em] font-black ${
                            order.status === "DELIVERED"
                              ? "bg-black text-white"
                              : order.status === "SHIPPED"
                              ? "bg-white text-black"
                              : "bg-white text-black"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-black">{formatPrice(order.total)}</td>
                      <td className="py-4 px-4 text-sm">
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
        <div className="border-2 border-black">
          <div className="p-8 border-b-2 border-black">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[-0.05em] leading-[0.9]">TOP PRODUCTS</h2>
          </div>
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">PRODUCT</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">SOLD</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">PRICE</th>
                  <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.3em] font-black">REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {data?.topProducts?.map(
                  (product: Product & { totalSold: number }) => (
                    <tr key={product.id} className="border-b border-black hover:bg-black hover:text-white transition-all">
                      <td className="py-4 px-4 font-black">{product.name}</td>
                      <td className="py-4 px-4 font-black">{product.totalSold}</td>
                      <td className="py-4 px-4 font-black">
                        {formatPrice(product.basePrice)}
                      </td>
                      <td className="py-4 px-4 font-black">
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
  );
}
