"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpDown,
  Heart,
  Search,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // Filter and sort items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name_asc") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "name_desc") {
      return b.name.localeCompare(a.name);
    } else if (sortBy === "price_asc") {
      return a.basePrice - b.basePrice;
    } else if (sortBy === "price_desc") {
      return b.basePrice - a.basePrice;
    } else {
      // Recent (default) - sort by addedAt if available
      return 0;
    }
  });

  const handleSelectAll = () => {
    if (selectedItems.size === sortedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedItems.map((item) => item.id)));
    }
  };

  const handleShare = async () => {
    const selected = sortedItems.filter((item) => selectedItems.has(item.id));
    const itemsToShare = selected.length > 0 ? selected : sortedItems;
    const text = `Check out my wishlist from VALUVA:\n${itemsToShare
      .map((item) => `- ${item.name}`)
      .join("\n")}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My VALUVA Wishlist",
          text: text,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert("Wishlist copied to clipboard!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-white flex items-center justify-center px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center">
              <Heart className="h-8 w-8 text-neutral-400" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#0a0a0a]">
              Sign in to view your wishlist
            </h1>
            <p className="text-sm text-neutral-400 font-normal">
              Create an account or sign in to save your favorite products
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/login">
              <Button size="sm" variant="filled" className="gap-1.5">
                Sign In
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                variant="outline"
                className="border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
              >
                Create Account
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-10 sm:py-12">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-[#0a0a0a]">
              My Wishlist
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-10 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-[#0a0a0a]">
              My Wishlist
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto text-center py-16 sm:py-20 space-y-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                <Heart className="h-8 w-8 text-neutral-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h2 className="text-xl sm:text-2xl font-normal tracking-normal text-[#0a0a0a]">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-neutral-400 font-normal">
                Start adding products you love to your wishlist
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/shop" className="inline-block">
                <Button size="sm" variant="filled" className="gap-1.5">
                  Start Shopping
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Modern Design */}
      <section className="relative border-b border-[#f5f5f5] bg-gradient-to-b from-white via-white to-[#fafafa]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01),transparent_70%)]" />
        <div className="container-luxury py-10 sm:py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#0a0a0a]">
                  My Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                  {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {sortedItems.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                    className="gap-1.5 border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
                <Link href="/shop" className="flex-1 sm:flex-initial">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Sort Bar - Refined */}
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your wishlist..."
                    className="pl-11 pr-4 h-10 rounded-[12px] border border-[#f5f5f5] focus:border-[#d0d0d0] bg-[#fafafa] text-xs font-normal shadow-none hover:bg-white"
                  />
                </div>

                {/* Sort */}
                <div className="w-full sm:w-[160px]">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full border border-[#f5f5f5] text-xs font-normal h-10 hover:border-[#e5e5e5] transition-all rounded-[12px] bg-[#fafafa] shadow-none hover:bg-white">
                      <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border border-[#f5f5f5] rounded-[14px] shadow-lg bg-white">
                      <SelectItem
                        value="recent"
                        className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                      >
                        Recently Added
                      </SelectItem>
                      <SelectItem
                        value="name_asc"
                        className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                      >
                        Name: A-Z
                      </SelectItem>
                      <SelectItem
                        value="name_desc"
                        className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                      >
                        Name: Z-A
                      </SelectItem>
                      <SelectItem
                        value="price_asc"
                        className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                      >
                        Price: Low to High
                      </SelectItem>
                      <SelectItem
                        value="price_desc"
                        className="text-xs font-normal rounded-[10px] focus:bg-[#fafafa] py-2"
                      >
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select All / Bulk Actions */}
                {sortedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSelectAll}
                      className="text-xs border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
                    >
                      {selectedItems.size === sortedItems.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    {selectedItems.size > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          // Handle bulk remove
                          const promises = Array.from(selectedItems).map(
                            (id) => {
                              const item = items.find((i) => i.id === id);
                              return item
                                ? dispatch(
                                    removeFromWishlist({
                                      productId: item.productId,
                                    })
                                  )
                                : Promise.resolve();
                            }
                          );
                          await Promise.all(promises);
                          setSelectedItems(new Set());
                        }}
                        className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove ({selectedItems.size})</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Grid - Modern Layout */}
      <section className="container-luxury py-10 sm:py-12 md:py-16">
        {sortedItems.length === 0 && searchQuery ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-20 sm:py-24 space-y-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
            >
              <Search className="h-7 w-7 text-neutral-400" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-base font-normal tracking-normal text-[#0a0a0a]">
                No items found
              </h2>
              <p className="text-xs text-neutral-400 font-normal">
                Try adjusting your search query
              </p>
            </div>
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="border-[#f5f5f5] hover:border-[#e5e5e5] bg-[#fafafa]"
              >
                Clear Search
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
          >
            <AnimatePresence>
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <WishlistItemCard
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={(id, selected) => {
                      const newSelected = new Set(selectedItems);
                      if (selected) {
                        newSelected.add(id);
                      } else {
                        newSelected.delete(id);
                      }
                      setSelectedItems(newSelected);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}
