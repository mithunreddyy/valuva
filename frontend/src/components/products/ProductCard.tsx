"use client";

import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { Product } from "@/types";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInWishlist = wishlist.some((item) => item.productId === product.id);
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.variants.length === 0) return;

    setIsAddingToCart(true);
    try {
      await dispatch(
        addToCart({
          variantId: product.variants[0].id,
          quantity: 1,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      await dispatch(removeFromWishlist(product.id));
    } else {
      await dispatch(addToWishlist(product.id));
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block card-luxury-hover"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#fafafa]">
            <span className="text-xs font-medium tracking-normal text-neutral-400">
              {product.name}
            </span>
          </div>
        )}

        {/* Badges */}
        {product.isNewArrival && (
          <div className="absolute left-3 top-3">
            <span className="bg-[#0a0a0a] text-[#fafafa] px-2 py-1 text-[10px] font-medium tracking-normal rounded-[4px]">
              New
            </span>
          </div>
        )}

        {/* Actions - Show on Hover */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`h-9 w-9 flex items-center justify-center border border-[#e5e5e5] transition-all hover:border-[#0a0a0a] rounded-[8px] ${
              isInWishlist
                ? "bg-[#0a0a0a] text-[#fafafa]"
                : "bg-white text-[#0a0a0a]"
            }`}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.totalStock === 0}
            className="h-9 w-9 flex items-center justify-center border border-[#e5e5e5] bg-white text-[#0a0a0a] hover:border-[#0a0a0a] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px]"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium tracking-normal line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {formatPrice(product.basePrice)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-500 line-through font-medium">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
