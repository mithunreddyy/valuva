"use client";

import { formatPrice } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { WishlistItem } from "@/types";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface WishlistItemCardProps {
  item: WishlistItem;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export function WishlistItemCard({
  item,
  isSelected = false,
  onSelect,
}: WishlistItemCardProps) {
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
    <div
      className={`group relative bg-white border transition-all rounded-[20px] overflow-hidden hover:shadow-lg ${
        isSelected
          ? "border-[#0a0a0a] shadow-md ring-2 ring-[#0a0a0a] ring-offset-2"
          : "border-[#e5e5e5] hover:border-[#0a0a0a]"
      }`}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute left-4 top-4 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(item.id, !isSelected);
            }}
            className={`w-6 h-6 rounded-[10px] border-2 flex items-center justify-center transition-all shadow-sm ${
              isSelected
                ? "bg-[#0a0a0a] border-[#0a0a0a]"
                : "bg-white/95 border-[#e5e5e5] hover:border-[#0a0a0a] backdrop-blur-md"
            }`}
          >
            {isSelected && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      <Link href={`/products/${item.slug}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa]">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-neutral-300" />
            </div>
          )}

          {/* Badge */}
          {item.addedAt && !onSelect && (
            <div className="absolute left-4 top-4">
              <span className="px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-[10px] font-medium tracking-normal rounded-[12px] backdrop-blur-sm">
                {new Date(item.addedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Actions - Show on Hover */}
          <div className="absolute right-4 top-4 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="h-10 w-10 flex items-center justify-center border border-[#e5e5e5] bg-white/90 text-[#0a0a0a] hover:border-[#0a0a0a] transition-all rounded-[16px] backdrop-blur-md"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="h-10 w-10 flex items-center justify-center border border-red-500/50 bg-white/90 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-[16px] backdrop-blur-md disabled:opacity-50"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-2.5">
        <div>
          <h3 className="text-sm font-medium tracking-normal mb-1.5 line-clamp-1 text-[#0a0a0a]">
            {item.name}
          </h3>
          {item.averageRating > 0 && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>⭐ {item.averageRating.toFixed(1)}</span>
              <span className="text-[10px]">
                ({item.reviewCount}{" "}
                {item.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#0a0a0a]">
            {formatPrice(item.basePrice)}
          </span>
          {item.compareAtPrice && (
            <span className="text-xs text-neutral-500 line-through font-medium">
              {formatPrice(item.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
