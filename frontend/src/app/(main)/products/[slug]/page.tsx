"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/product-reviews";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart } from "@/hooks/use-cart";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useProduct(params.slug);
  const { data: relatedData } = useRelatedProducts(data?.data?.id || "");
  const addToCart = useAddToCart();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container-luxury py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="container-luxury py-16 text-center">
        <h1 className="text-2xl font-medium tracking-normal">
          Product not found
        </h1>
      </div>
    );
  }

  const product = data.data;
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const isInWishlist = wishlist.some((item) => item.productId === product.id);

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart.mutate({ variantId: selectedVariant.id, quantity });
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Product Details */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square border border-[#e5e5e5] overflow-hidden bg-[#fafafa] mb-3 rounded-[12px]">
                <Image
                  src={product.images[selectedImage]?.url || "/placeholder.png"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="object-cover w-full h-full transition-all duration-500"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square border overflow-hidden transition-all rounded-[8px] ${
                      selectedImage === index
                        ? "border-[#0a0a0a]"
                        : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl md:text-3xl font-medium">
                    {formatPrice(product.basePrice)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-base text-neutral-500 line-through font-medium">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                {product.reviewCount && product.reviewCount! > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-[#0a0a0a]" />
                    <span className="text-sm font-medium">
                      {product.averageRating}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      ({product.reviewCount}{" "}
                      {product.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <label className="block text-xs font-medium tracking-normal mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-xs font-medium tracking-normal transition-all rounded-[8px] ${
                          selectedSize === size
                            ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                            : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <label className="block text-xs font-medium tracking-normal mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const variant = product.variants.find(
                        (v) => v.color === color
                      );
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border text-xs font-medium tracking-normal transition-all flex items-center gap-2 rounded-[8px] ${
                            selectedColor === color
                              ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                              : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                          }`}
                        >
                          {variant?.colorHex && (
                            <span
                              className="w-4 h-4 border border-[#e5e5e5] rounded-[4px]"
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

              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium tracking-normal mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-[#e5e5e5] flex items-center justify-center hover:border-[#0a0a0a] transition-all rounded-[8px] disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-base font-medium w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          quantity + 1,
                          selectedVariant?.stock || product.totalStock
                        )
                      )
                    }
                    className="w-10 h-10 border border-[#e5e5e5] flex items-center justify-center hover:border-[#0a0a0a] transition-all rounded-[8px] disabled:opacity-50"
                    disabled={
                      quantity >= (selectedVariant?.stock || product.totalStock)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  size="lg"
                  variant="filled"
                  className="flex-1 rounded-[10px]"
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || !selectedVariant}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="rounded-[10px]"
                >
                  <Heart
                    className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              {selectedVariant && (
                <p className="text-xs font-medium tracking-normal text-neutral-500">
                  {selectedVariant.stock > 0
                    ? `${selectedVariant.stock} in stock`
                    : "Out of stock"}
                </p>
              )}

              {/* Product Details */}
              <div className="border-t border-[#e5e5e5] pt-5 space-y-3">
                {product.brand && (
                  <div className="flex gap-4">
                    <span className="text-xs font-medium w-20">Brand:</span>
                    <span className="text-sm font-medium">{product.brand}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex gap-4">
                    <span className="text-xs font-medium w-20">Material:</span>
                    <span className="text-sm font-medium">
                      {product.material}
                    </span>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="flex gap-4">
                    <span className="text-xs font-medium w-20">Care:</span>
                    <span className="text-sm font-medium">
                      {product.careInstructions}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-white border-t border-[#e5e5e5]">
        <div className="container-luxury">
          <ProductReviews productId={product.id} />
        </div>
      </section>

      {/* Related Products */}
      {relatedData && relatedData.data.length > 0 && (
        <section className="section-padding bg-[#fafafa]">
          <div className="container-luxury">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-normal mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedData.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
