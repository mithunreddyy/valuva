"use client";

import { ProductCard } from "@/components/products/products-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart } from "@/hooks/use-cart";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useProduct(params.slug);
  const { data: relatedData } = useRelatedProducts(data?.data?.id || "");
  const addToCart = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const product = data.data;
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart.mutate({ variantId: selectedVariant.id, quantity });
    }
  };

  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <div className="relative z-10 container mx-auto px-4 py-12">
      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.png"}
              alt={product.name}
              width={800}
              height={800}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-black"
                    : "border-transparent"
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
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {formatPrice(product.basePrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg text-neutral-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{product.averageRating}</span>
                  <span className="text-neutral-600">
                    ({product.reviewCount})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-neutral-600">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block font-medium mb-3">Size</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 border rounded-md font-medium transition-colors ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block font-medium mb-3">Color</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-3 border rounded-md font-medium transition-colors ${
                    selectedColor === color
                      ? "bg-black text-white"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-medium mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-md hover:bg-neutral-50"
              >
                -
              </button>
              <span className="font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-md hover:bg-neutral-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || !selectedVariant}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {selectedVariant && (
            <p className="text-sm text-neutral-600">
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : "Out of stock"}
            </p>
          )}

          {/* Product Details */}
          <div className="border-t pt-6 space-y-3">
            {product.brand && (
              <div className="flex gap-2">
                <span className="text-neutral-600">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            {product.material && (
              <div className="flex gap-2">
                <span className="text-neutral-600">Material:</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.careInstructions && (
              <div className="flex gap-2">
                <span className="text-neutral-600">Care:</span>
                <span className="font-medium">{product.careInstructions}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedData && relatedData.data.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedData.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
