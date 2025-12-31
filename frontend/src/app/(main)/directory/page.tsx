"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart,
  CreditCard,
  FileText,
  Grid3x3,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Ticket,
  Truck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface Route {
  path: string;
  title: string;
  description: string;
  category: "main" | "auth" | "user" | "admin" | "legal";
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

const routes: Route[] = [
  // Main Routes
  {
    path: "/",
    title: "Home",
    description: "Discover our collection of minimal luxury clothing",
    category: "main",
    icon: Home,
  },
  {
    path: "/shop",
    title: "Shop",
    description: "Browse our complete collection of products",
    category: "main",
    icon: ShoppingBag,
  },
  {
    path: "/cart",
    title: "Shopping Cart",
    description: "Review and manage your cart items",
    category: "main",
    icon: ShoppingCart,
    requiresAuth: false,
  },
  {
    path: "/checkout",
    title: "Checkout",
    description: "Complete your purchase securely",
    category: "main",
    icon: CreditCard,
    requiresAuth: true,
  },
  {
    path: "/wishlist",
    title: "Wishlist",
    description: "Your saved favorite products",
    category: "main",
    icon: Heart,
    requiresAuth: true,
  },
  {
    path: "/search",
    title: "Search",
    description: "Find products by name, category, or keyword",
    category: "main",
    icon: Search,
  },
  {
    path: "/compare",
    title: "Compare Products",
    description: "Compare multiple products side by side",
    category: "main",
    icon: Grid3x3,
  },
  {
    path: "/about",
    title: "About Us",
    description: "Learn about our brand and mission",
    category: "main",
    icon: FileText,
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Get in touch with our team",
    category: "main",
    icon: Mail,
  },
  {
    path: "/support",
    title: "Support",
    description: "Customer support and help center",
    category: "main",
    icon: HelpCircle,
  },
  {
    path: "/faq",
    title: "FAQ",
    description: "Frequently asked questions",
    category: "main",
    icon: HelpCircle,
  },
  {
    path: "/shipping",
    title: "Shipping Information",
    description: "Shipping policies and delivery options",
    category: "main",
    icon: Truck,
  },
  {
    path: "/returns",
    title: "Returns",
    description: "Return or exchange your orders",
    category: "main",
    icon: Package,
    requiresAuth: true,
  },

  // Auth Routes
  {
    path: "/login",
    title: "Login",
    description: "Sign in to your account",
    category: "auth",
    icon: Lock,
  },
  {
    path: "/register",
    title: "Register",
    description: "Create a new account",
    category: "auth",
    icon: User,
  },
  {
    path: "/forgot-password",
    title: "Forgot Password",
    description: "Reset your password",
    category: "auth",
    icon: Lock,
  },
  {
    path: "/reset-password",
    title: "Reset Password",
    description: "Set a new password",
    category: "auth",
    icon: Lock,
  },
  {
    path: "/verify-email",
    title: "Verify Email",
    description: "Verify your email address",
    category: "auth",
    icon: Mail,
  },
  //   {
  //     path: "/admin-login",
  //     title: "Admin Login",
  //     description: "Administrator login portal",
  //     category: "auth",
  //     icon: Shield,
  //   },

  // User Dashboard Routes
  {
    path: "/dashboard",
    title: "Dashboard",
    description: "Your account overview and profile",
    category: "user",
    icon: LayoutDashboard,
    requiresAuth: true,
  },
  {
    path: "/dashboard/orders",
    title: "My Orders",
    description: "View and track your orders",
    category: "user",
    icon: Package,
    requiresAuth: true,
  },
  {
    path: "/dashboard/addresses",
    title: "Addresses",
    description: "Manage your shipping addresses",
    category: "user",
    icon: MapPin,
    requiresAuth: true,
  },
  {
    path: "/dashboard/returns",
    title: "My Returns",
    description: "Track your return requests",
    category: "user",
    icon: Package,
    requiresAuth: true,
  },

  // Admin Routes
  {
    path: "/admin",
    title: "Admin Dashboard",
    description: "Administrative control panel",
    category: "admin",
    icon: LayoutDashboard,
    requiresAdmin: true,
  },
  {
    path: "/admin/products",
    title: "Products Management",
    description: "Manage product catalog",
    category: "admin",
    icon: Package,
    requiresAdmin: true,
  },
  {
    path: "/admin/orders",
    title: "Orders Management",
    description: "View and manage all orders",
    category: "admin",
    icon: ShoppingCart,
    requiresAdmin: true,
  },
  {
    path: "/admin/customers",
    title: "Customers",
    description: "Manage customer accounts",
    category: "admin",
    icon: Users,
    requiresAdmin: true,
  },
  {
    path: "/admin/categories",
    title: "Categories",
    description: "Manage product categories",
    category: "admin",
    icon: Tag,
    requiresAdmin: true,
  },
  {
    path: "/admin/coupons",
    title: "Coupons",
    description: "Create and manage discount coupons",
    category: "admin",
    icon: Ticket,
    requiresAdmin: true,
  },
  {
    path: "/admin/reviews",
    title: "Reviews",
    description: "Moderate product reviews",
    category: "admin",
    icon: MessageSquare,
    requiresAdmin: true,
  },
  {
    path: "/admin/homepage",
    title: "Homepage",
    description: "Customize homepage sections",
    category: "admin",
    icon: LayoutDashboard,
    requiresAdmin: true,
  },
  {
    path: "/admin/analytics",
    title: "Analytics",
    description: "View business analytics and insights",
    category: "admin",
    icon: BarChart,
    requiresAdmin: true,
  },
  {
    path: "/admin/tracking",
    title: "Order Tracking",
    description: "Manage order tracking and shipments",
    category: "admin",
    icon: Truck,
    requiresAdmin: true,
  },
  {
    path: "/admin/security",
    title: "Security",
    description: "Security settings and logs",
    category: "admin",
    icon: Shield,
    requiresAdmin: true,
  },

  // Legal Routes
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description: "Our privacy and data protection policy",
    category: "legal",
    icon: FileText,
  },
  {
    path: "/terms-of-service",
    title: "Terms of Service",
    description: "Terms and conditions of use",
    category: "legal",
    icon: FileText,
  },
  {
    path: "/return-policy",
    title: "Return Policy",
    description: "Our return and refund policy",
    category: "legal",
    icon: FileText,
  },
  {
    path: "/cookie-policy",
    title: "Cookie Policy",
    description: "Information about our use of cookies",
    category: "legal",
    icon: FileText,
  },
];

const categoryConfig = {
  main: {
    label: "Main Pages",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200/50",
    iconColor: "text-blue-600",
  },
  auth: {
    label: "Authentication",
    color: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-200/50",
    iconColor: "text-purple-600",
  },
  user: {
    label: "User Dashboard",
    color: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-200/50",
    iconColor: "text-green-600",
  },
  admin: {
    label: "Admin Panel",
    color: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-200/50",
    iconColor: "text-orange-600",
  },
  legal: {
    label: "Legal & Policies",
    color: "from-gray-500/10 to-slate-500/10",
    borderColor: "border-gray-200/50",
    iconColor: "text-gray-600",
  },
};

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      // Hide admin routes
      if (route.category === "admin") {
        return false;
      }

      const matchesSearch =
        route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.path.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || route.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedRoutes = useMemo(() => {
    const groups: Record<string, Route[]> = {};
    filteredRoutes.forEach((route) => {
      if (!groups[route.category]) {
        groups[route.category] = [];
      }
      groups[route.category].push(route);
    });
    return groups;
  }, [filteredRoutes]);

  const categories = ["all", ...Object.keys(categoryConfig)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-[#e5e5e5] bg-gradient-to-br from-white via-[#fafafa] to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container-luxury relative py-8 sm:py-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-4 sm:mb-5 shadow-lg"
            >
              <Grid3x3 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0a0a0a] mb-2 sm:mb-3">
              Route Directory
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed px-4 sm:px-0">
              Explore all available pages and routes in our application. Find
              what you&apos;re looking for with ease.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-luxury py-6 sm:py-8 lg:py-10">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search routes, pages, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-xl border border-[#e5e5e5] rounded-[16px] sm:rounded-[20px] text-sm font-medium text-[#0a0a0a] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/20 focus:border-[#0a0a0a]/30 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((category) => category !== "admin")
              .map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[#0a0a0a] text-white shadow-lg"
                      : "bg-white/60 backdrop-blur-sm border border-[#e5e5e5] text-neutral-600 hover:bg-white hover:border-[#0a0a0a]/20"
                  }`}
                >
                  {category === "all"
                    ? "All Routes"
                    : categoryConfig[category as keyof typeof categoryConfig]
                        .label}
                </button>
              ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-neutral-500 font-medium">
            {filteredRoutes.length} route
            {filteredRoutes.length !== 1 ? "s" : ""} found
          </div>
        </motion.div>

        {/* Routes Grid */}
        <div className="space-y-8">
          {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => {
            const config =
              categoryConfig[category as keyof typeof categoryConfig];
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div
                    className={`w-1 h-5 sm:h-6 rounded-full bg-gradient-to-b ${config.color}`}
                  />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-[#0a0a0a]">
                    {config.label}
                  </h2>
                  <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    {categoryRoutes.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {categoryRoutes.map((route, index) => {
                    const Icon = route.icon;
                    return (
                      <motion.div
                        key={route.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          duration: 0.5,
                        }}
                      >
                        <Link
                          href={route.path}
                          className="group block h-full"
                          prefetch={true}
                        >
                          <div
                            className={`relative h-full p-4 sm:p-5 lg:p-6 bg-white/80 backdrop-blur-xl border ${config.borderColor} rounded-[16px] sm:rounded-[20px] transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:border-[#0a0a0a]/20`}
                          >
                            {/* Background Gradient */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-30 sm:opacity-0 sm:group-hover:opacity-100 rounded-[16px] sm:rounded-[20px] transition-opacity duration-300`}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                              {/* Icon */}
                              <div
                                className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[16px] bg-gradient-to-br ${config.color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                              >
                                <Icon
                                  className={`h-5 w-5 sm:h-6 sm:w-6 ${config.iconColor}`}
                                />
                              </div>

                              {/* Title */}
                              <h3 className="text-sm sm:text-base font-semibold text-[#0a0a0a] mb-1.5 sm:mb-2 group-hover:text-[#0a0a0a] transition-colors">
                                {route.title}
                              </h3>

                              {/* Description */}
                              <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                                {route.description}
                              </p>

                              {/* Path */}
                              <div className="flex items-center justify-between">
                                <code className="text-xs font-mono text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">
                                  {route.path}
                                </code>
                                <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-[#0a0a0a] group-hover:translate-x-1 transition-all" />
                              </div>

                              {/* Badges */}
                              <div className="flex gap-2 mt-4">
                                {route.requiresAuth && (
                                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                    Auth Required
                                  </span>
                                )}
                                {route.requiresAdmin && (
                                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                                    Admin Only
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRoutes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 mb-4">
              <Search className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">
              No routes found
            </h3>
            <p className="text-sm text-neutral-500 font-medium">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
