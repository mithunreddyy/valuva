"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchWishlist } from "@/store/slices/wishlistSlice";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-24">
        <div className="container-luxury text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#e5e5e5] flex items-center justify-center">
              <Heart className="h-10 w-10 text-neutral-400" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
              Sign in to view your wishlist
            </h1>
            <p className="text-sm text-neutral-500 font-medium tracking-normal max-w-md mx-auto">
              Create an account or sign in to save your favorite products
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="filled">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
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
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-normal">
              My Wishlist
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-normal">
              My Wishlist
            </h1>
          </div>
          <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                <Heart className="h-12 w-12 text-neutral-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-neutral-500 font-medium tracking-normal">
                Start adding products you love to your wishlist
              </p>
            </div>
            <Link href="/shop">
              <Button size="lg" variant="filled">
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
        <div className="container-luxury py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
                My Wishlist
              </h1>
              <p className="text-sm text-neutral-500 font-medium tracking-normal">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <Link href="/shop">
              <Button size="lg" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
