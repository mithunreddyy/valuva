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
import { ArrowUpDown, Heart, Search, Share2, Trash2 } from "lucide-react";
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
      <div className="min-h-[calc(100vh-200px)] bg-[#fafafa] flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
              Sign in to view your wishlist
            </h1>
            <p className="text-sm text-neutral-500 font-medium tracking-normal">
              Create an account or sign in to save your favorite products
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button
                size="sm"
                variant="filled"
                className="rounded-[10px] w-auto sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                variant="outline"
                className="rounded-[10px] w-auto sm:w-auto"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
              My Wishlist
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
              My Wishlist
            </h1>
          </div>
          <div className="max-w-md mx-auto text-center py-8 sm:py-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
                <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal text-[#0a0a0a]">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-neutral-500 font-medium tracking-normal">
                Start adding products you love to your wishlist
              </p>
            </div>
            <Link href="/shop" className="inline-block">
              <Button size="lg" variant="filled" className="rounded-[16px]">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-6 sm:py-8">
          <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-1">
                  My Wishlist
                </h1>
                <p className="text-sm text-neutral-500 font-medium tracking-normal">
                  {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {sortedItems.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                    className="rounded-[16px] flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
                <Link href="/shop" className="flex-1 sm:flex-initial">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-[16px] w-full sm:w-auto"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Sort Bar */}
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your wishlist..."
                    className="pl-11 pr-4 h-11 rounded-[16px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm shadow-sm"
                  />
                </div>

                {/* Sort */}
                <div className="w-full sm:w-[180px]">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full border border-[#e5e5e5] text-sm font-medium h-11 hover:border-[#0a0a0a] transition-all rounded-[16px] bg-white shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-neutral-500" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border border-[#e5e5e5] rounded-[16px] shadow-lg bg-white">
                      <SelectItem
                        value="recent"
                        className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                      >
                        Recently Added
                      </SelectItem>
                      <SelectItem
                        value="name_asc"
                        className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                      >
                        Name: A-Z
                      </SelectItem>
                      <SelectItem
                        value="name_desc"
                        className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                      >
                        Name: Z-A
                      </SelectItem>
                      <SelectItem
                        value="price_asc"
                        className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
                      >
                        Price: Low to High
                      </SelectItem>
                      <SelectItem
                        value="price_desc"
                        className="text-sm font-medium rounded-[12px] focus:bg-[#fafafa] py-2.5"
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
                      className="rounded-[16px] text-xs sm:text-sm"
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
                                ? dispatch(removeFromWishlist(item.productId))
                                : Promise.resolve();
                            }
                          );
                          await Promise.all(promises);
                          setSelectedItems(new Set());
                        }}
                        className="rounded-[16px] text-xs sm:text-sm text-red-600 border-red-500 hover:bg-red-50 flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove ({selectedItems.size})</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container-luxury py-6 sm:py-8">
        {sortedItems.length === 0 && searchQuery ? (
          <div className="text-center py-12 sm:py-16 space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-neutral-300" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal text-[#0a0a0a]">
                No items found
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                Try adjusting your search query
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="rounded-[16px]"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sortedItems.map((item) => (
              <WishlistItemCard
                key={item.id}
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
