"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import {
  BarChart,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user ||
      !["ADMIN", "SUPER_ADMIN"].includes(user.role)
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (
    !isAuthenticated ||
    !user ||
    !["ADMIN", "SUPER_ADMIN"].includes(user.role)
  ) {
    return null;
  }

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-[#e5e5e5]">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-medium tracking-normal">Valuva Admin</h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            {user.email}
          </p>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <Package className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <Users className="h-5 w-5" />
            <span>Customers</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <Tag className="h-5 w-5" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/admin/tracking"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-[#fafafa] transition-colors text-sm font-medium tracking-normal"
          >
            <Truck className="h-5 w-5" />
            <span>Tracking</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e5e5e5]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-red-50 text-red-600 transition-colors text-sm font-medium tracking-normal"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">{children}</div>
    </div>
  );
}
