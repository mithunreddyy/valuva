"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { WishlistItem } from "@/types";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface WishlistItemCardProps {
  item: WishlistItem;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    try {
      await dispatch(removeFromWishlist(item.productId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/products/${item.slug}`;
  };

  return (
    <Link
      href={`/products/${item.slug}`}
      className="group relative block bg-white border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all rounded-[10px] overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-neutral-300" />
          </div>
        )}

        {/* Badge */}
        {item.isNewArrival && (
          <div className="absolute left-3 top-3">
            <span className="px-2 py-1 bg-[#0a0a0a] text-[#fafafa] text-[10px] font-medium tracking-normal rounded-[6px]">
              New
            </span>
          </div>
        )}

        {/* Actions - Show on Hover */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="h-9 w-9 flex items-center justify-center border border-[#e5e5e5] bg-white text-[#0a0a0a] hover:border-[#0a0a0a] transition-all rounded-[8px]"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-9 w-9 flex items-center justify-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-[8px] disabled:opacity-50"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="text-sm font-medium tracking-normal mb-1 line-clamp-1">
            {item.name}
          </h3>
          {item.averageRating > 0 && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>⭐ {item.averageRating.toFixed(1)}</span>
              <span className="text-[10px]">
                ({item.reviewCount} {item.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {formatPrice(item.basePrice)}
          </span>
          {item.compareAtPrice && (
            <span className="text-xs text-neutral-500 line-through font-medium">
              {formatPrice(item.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
