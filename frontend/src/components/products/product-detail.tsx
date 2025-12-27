"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { Product } from "@/types";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
}

/**
 * Product Detail Component
 * Displays detailed product information with image gallery, variants, and actions
 */
export function ProductDetail({ product }: ProductDetailProps) {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInWishlist = wishlist.some((item) => item.productId === product.id);

  // Get available sizes and colors from variants
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size))
  );
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color))
  );

  // Find selected variant
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  // Auto-select first variant if none selected
  if (!selectedSize && availableSizes.length > 0) {
    setSelectedSize(availableSizes[0]);
  }
  if (!selectedColor && availableColors.length > 0) {
    setSelectedColor(availableColors[0]);
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setIsAddingToCart(true);
    try {
      await dispatch(
        addToCart({
          variantId: selectedVariant.id,
          quantity,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      await dispatch(removeFromWishlist(product.id));
    } else {
      await dispatch(addToWishlist(product.id));
    }
  };

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.basePrice) /
          product.compareAtPrice) *
          100
      )
    : 0;

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "/placeholder.png";

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div>
        <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-4">
          <Image
            src={product.images[selectedImageIndex]?.url || primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-4 left-4">
              {discount}% OFF
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge className="absolute top-4 right-4">New</Badge>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition ${
                  selectedImageIndex === index
                    ? "border-black"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Brand */}
        {product.brand && (
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h1 className="text-4xl font-bold">{product.name}</h1>

        {/* Rating */}
        {product.averageRating && product.reviewCount ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.averageRating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-500">
              ({product.reviewCount} reviews)
            </span>
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold">
            {formatPrice(product.basePrice)}
          </span>
          {product.compareAtPrice && (
            <span className="text-2xl text-neutral-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variants */}
        {availableSizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Size: {selectedSize || "Select a size"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableColors.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Color: {selectedColor || "Select a color"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => {
                const variant = product.variants.find((v) => v.color === color);
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md transition flex items-center gap-2 ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    {variant?.colorHex && (
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    )}
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock Status */}
        {selectedVariant && (
          <div>
            {selectedVariant.stock > 0 ? (
              <p className="text-sm text-green-600">
                {selectedVariant.stock} in stock
              </p>
            ) : (
              <p className="text-sm text-red-600">Out of stock</p>
            )}
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-neutral-100"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.min(
                      quantity + 1,
                      selectedVariant?.stock || product.totalStock
                    )
                  )
                }
                className="p-2 hover:bg-neutral-100"
                disabled={
                  quantity >= (selectedVariant?.stock || product.totalStock)
                }
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={
              isAddingToCart ||
              !selectedVariant ||
              (selectedVariant?.stock || 0) === 0
            }
            className="flex-1"
          >
            {isAddingToCart ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleWishlistToggle}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        {/* Additional Info */}
        {product.material && (
          <div>
            <h3 className="text-sm font-semibold mb-1">Material</h3>
            <p className="text-sm text-neutral-600">{product.material}</p>
          </div>
        )}

        {product.careInstructions && (
          <div>
            <h3 className="text-sm font-semibold mb-1">Care Instructions</h3>
            <p className="text-sm text-neutral-600">
              {product.careInstructions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
