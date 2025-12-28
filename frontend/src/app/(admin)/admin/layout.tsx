"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import {
  BarChart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShoppingCart,
  Tag,
  Ticket,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/homepage", label: "Homepage", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    { href: "/admin/tracking", label: "Tracking", icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-[#e5e5e5] z-50">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#e5e5e5]">
            <h2 className="text-base font-medium tracking-tight text-[#0a0a0a]">
              Valuva Admin
            </h2>
            <p className="text-xs text-neutral-500 font-medium mt-1.5 truncate">
              {user.email}
            </p>
            {user.role === "SUPER_ADMIN" && (
              <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-[#0a0a0a] text-white rounded-[6px]">
                Super Admin
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-sm font-medium tracking-normal ${
                    isActive
                      ? "bg-[#0a0a0a] text-white"
                      : "text-neutral-700 hover:bg-[#fafafa] hover:text-[#0a0a0a]"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#e5e5e5]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-red-50 text-red-600 transition-all text-sm font-medium tracking-normal"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
