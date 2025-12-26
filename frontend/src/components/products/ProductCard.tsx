import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { Product } from "@/types";
import { Heart, ShoppingCart, Star } from "lucide-react";
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
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.basePrice) /
          product.compareAtPrice) *
          100
      )
    : 0;

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
      className="group relative block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={primaryImage || "/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition hover:bg-gray-100"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.totalStock === 0}
          className="absolute inset-x-2 bottom-2 rounded bg-black px-4 py-2 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isAddingToCart ? (
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding...
            </span>
          ) : product.totalStock === 0 ? (
            "Out of Stock"
          ) : (
            <span className="flex items-center justify-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Quick Add
            </span>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* Rating */}
        {product.averageRating && product.reviewCount ? (
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        ) : null}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.basePrice}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.compareAtPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.totalStock <= 10 && product.totalStock > 0 && (
          <p className="mt-2 text-xs text-orange-600">
            Only {product.totalStock} left!
          </p>
        )}
      </div>
    </Link>
  );
};
