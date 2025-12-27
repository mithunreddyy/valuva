"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Profile", icon: User },
    { href: "/dashboard/orders", label: "Orders", icon: Package },
    { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container-luxury py-8 sm:py-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all font-medium ${
                        isActive
                          ? "bg-[#0a0a0a] text-[#fafafa]"
                          : "hover:bg-[#fafafa] text-[#0a0a0a]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm tracking-normal">{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-red-50 text-red-600 transition-all font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm tracking-normal">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
