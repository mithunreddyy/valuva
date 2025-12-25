"use client";

import { useAuthStore } from "@/store/auth-store";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass rounded-lg p-6 sticky top-24">
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-black/5 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-black/5 transition-colors"
                >
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/dashboard/addresses"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-black/5 transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Addresses</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-black/5 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
