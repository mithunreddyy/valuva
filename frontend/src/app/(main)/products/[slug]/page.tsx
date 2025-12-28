"use client";

import { ProductCard } from "@/components/products/ProductCard";
import {
  ProductImageModal,
  ProductImageZoom,
} from "@/components/products/product-image-zoom";
import { ProductReviews } from "@/components/products/product-reviews";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAddToCart } from "@/hooks/use-cart";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import {
  Heart,
  Info,
  Minus,
  Package,
  Plus,
  Ruler,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useProduct(params.slug);
  const { data: relatedData } = useRelatedProducts(data?.data?.id || "");
  const addToCart = useAddToCart();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const analytics = useAnalytics();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "care" | "shipping"
  >("description");

  // Track product view
  useEffect(() => {
    if (data?.data?.id) {
      analytics.trackProductView(data.data.id, {
        name: data.data.name,
        price: Number(data.data.basePrice),
        category: data.data.category?.name,
      });
    }
  }, [
    data?.data?.id,
    analytics,
    data?.data?.name,
    data?.data?.basePrice,
    data?.data?.category?.name,
  ]);

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
      addToCart.mutate(
        { variantId: selectedVariant.id, quantity },
        {
          onSuccess: () => {
            // Track analytics
            analytics.trackAddToCart(
              product.id,
              selectedVariant.id,
              quantity,
              Number(selectedVariant.price)
            );
          },
        }
      );
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      analytics.trackWishlistRemove(product.id);
    } else {
      dispatch(addToWishlist(product.id));
      analytics.trackWishlistAdd(product.id);
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
              <div
                className="aspect-square border border-[#e5e5e5] overflow-hidden bg-[#fafafa] mb-3 rounded-[12px] cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                {product.images[selectedImage]?.url ? (
                  <ProductImageZoom
                    src={product.images[selectedImage].url}
                    alt={product.images[selectedImage].altText || product.name}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                    <span className="text-neutral-400">No Image Available</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
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
                      alt={image.altText || product.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
              {product.images.length > 0 && (
                <ProductImageModal
                  images={product.images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    altText: img.altText || product.name,
                  }))}
                  initialIndex={selectedImage}
                  isOpen={isImageModalOpen}
                  onClose={() => setIsImageModalOpen(false)}
                  productName={product.name}
                />
              )}
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

              {/* Short Description */}
              {product.shortDescription && (
                <div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    {product.shortDescription}
                  </p>
                </div>
              )}

              {/* Description */}
              {!product.shortDescription && (
                <div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
              )}

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

      {/* Detailed Information Tabs */}
      {(product.longDescription ||
        product.specifications ||
        product.washCareInstructions ||
        product.shippingInfo ||
        product.sizeGuide) && (
        <section className="bg-white border-t border-[#e5e5e5]">
          <div className="container-luxury py-8 sm:py-10">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-[#e5e5e5]">
              {product.longDescription && (
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === "description"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  Description
                </button>
              )}
              {product.specifications && (
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === "specs"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Package className="h-3.5 w-3.5 inline mr-1.5" />
                  Specifications
                </button>
              )}
              {(product.washCareInstructions || product.careInstructions) && (
                <button
                  onClick={() => setActiveTab("care")}
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === "care"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Info className="h-3.5 w-3.5 inline mr-1.5" />
                  Care Instructions
                </button>
              )}
              {(product.shippingInfo || product.sizeGuide) && (
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === "shipping"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Truck className="h-3.5 w-3.5 inline mr-1.5" />
                  Shipping & Size
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl">
              {activeTab === "description" && product.longDescription && (
                <div className="space-y-4">
                  <div
                    className="text-sm text-neutral-700 leading-relaxed font-medium prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: product.longDescription.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {activeTab === "specs" && product.specifications && (
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-start py-3 border-b border-[#e5e5e5] last:border-0"
                      >
                        <span className="text-xs font-medium text-neutral-600 capitalize w-32 flex-shrink-0">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-sm font-medium text-[#0a0a0a] text-right flex-1">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}

              {activeTab === "care" &&
                (product.washCareInstructions || product.careInstructions) && (
                  <div className="space-y-4">
                    <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-5">
                      <h3 className="text-sm font-medium mb-3 text-[#0a0a0a]">
                        Wash Care Instructions
                      </h3>
                      <div className="text-sm text-neutral-700 leading-relaxed font-medium whitespace-pre-line">
                        {product.washCareInstructions ||
                          product.careInstructions}
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === "shipping" && (
                <div className="space-y-6">
                  {product.shippingInfo && (
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-[#0a0a0a] flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipping Information
                      </h3>
                      <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-5 space-y-3">
                        {product.shippingInfo.processingTime && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-neutral-600">
                              Processing Time:
                            </span>
                            <span className="text-sm font-medium text-[#0a0a0a]">
                              {product.shippingInfo.processingTime}
                            </span>
                          </div>
                        )}
                        {product.shippingInfo.shippingTime && (
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-neutral-600">
                              Shipping Time:
                            </span>
                            <span className="text-sm font-medium text-[#0a0a0a]">
                              {product.shippingInfo.shippingTime}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-neutral-600">
                            Free Shipping:
                          </span>
                          <span className="text-sm font-medium text-[#0a0a0a]">
                            {product.shippingInfo.freeShipping ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-neutral-600">
                            Returnable:
                          </span>
                          <span className="text-sm font-medium text-[#0a0a0a]">
                            {product.shippingInfo.returnable ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-neutral-600">
                            Exchangeable:
                          </span>
                          <span className="text-sm font-medium text-[#0a0a0a]">
                            {product.shippingInfo.exchangeable ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {product.sizeGuide && (
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-[#0a0a0a] flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        Size Guide
                        {product.sizeGuide.title &&
                          ` - ${product.sizeGuide.title}`}
                      </h3>
                      {product.sizeGuide.measurements && (
                        <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a]">
                                    Size
                                  </th>
                                  {product.sizeGuide.measurements[0]?.chest && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a]">
                                      Chest
                                    </th>
                                  )}
                                  {product.sizeGuide.measurements[0]?.waist && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a]">
                                      Waist
                                    </th>
                                  )}
                                  {product.sizeGuide.measurements[0]
                                    ?.length && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a]">
                                      Length
                                    </th>
                                  )}
                                  {product.sizeGuide.measurements[0]
                                    ?.sleeve && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a]">
                                      Sleeve
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {product.sizeGuide.measurements.map(
                                  (measurement, index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-[#e5e5e5] last:border-0"
                                    >
                                      <td className="px-4 py-3 font-medium text-[#0a0a0a]">
                                        {measurement.size}
                                      </td>
                                      {measurement.chest && (
                                        <td className="px-4 py-3 text-neutral-600 font-medium">
                                          {measurement.chest}
                                        </td>
                                      )}
                                      {measurement.waist && (
                                        <td className="px-4 py-3 text-neutral-600 font-medium">
                                          {measurement.waist}
                                        </td>
                                      )}
                                      {measurement.length && (
                                        <td className="px-4 py-3 text-neutral-600 font-medium">
                                          {measurement.length}
                                        </td>
                                      )}
                                      {measurement.sleeve && (
                                        <td className="px-4 py-3 text-neutral-600 font-medium">
                                          {measurement.sleeve}
                                        </td>
                                      )}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {product.sizeGuide.notes && (
                        <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                          {product.sizeGuide.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
