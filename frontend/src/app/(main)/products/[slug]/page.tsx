"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { DeliveryOptions } from "@/components/products/delivery-options";
import {
  ProductImageModal,
  ProductImageZoom,
} from "@/components/products/product-image-zoom";
import { ProductRecommendations } from "@/components/products/product-recommendations";
import { ProductReviews } from "@/components/products/product-reviews";
import { SizeGuide } from "@/components/products/size-guide";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ShareButtons } from "@/components/social/share-buttons";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAddToCart } from "@/hooks/use-cart";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { toast } from "@/hooks/use-toast";
import { generateProductStructuredDataWithReviews } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Info,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-[20px]" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4 rounded-[12px]" />
              <Skeleton className="h-8 w-1/2 rounded-[12px]" />
              <Skeleton className="h-32 w-full rounded-[12px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container-luxury text-center space-y-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a]">
            Product not found
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/shop">
            <Button size="lg" variant="filled" className="rounded-[16px] gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
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
            toast({
              title: "Added to cart!",
              description: `${product.name} has been added to your cart`,
            });
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to add product to cart. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      toast({
        title: "Select options",
        description: "Please select size and color before adding to cart",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: product.id }));
      analytics.trackWishlistRemove(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      dispatch(addToWishlist({ productId: product.id }));
      analytics.trackWishlistAdd(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = [...new Set(product.variants.map((v) => v.color))];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const productImage = product.images[0]?.url || "/og-image.jpg";
  // Use pre-calculated values from backend, fallback to calculating from reviews if needed
  const averageRating =
    product.averageRating ??
    (product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r) => sum + r.rating, 0) /
        product.reviews.length
      : undefined);
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;

  // Generate product structured data
  const productStructuredData = generateProductStructuredDataWithReviews({
    name: product.name,
    description: product.description,
    images: product.images.map((img) => ({ url: img.url })),
    slug: product.slug,
    price: Number(product.basePrice),
    availability: product.totalStock > 0 ? "in stock" : "out of stock",
    category: product.category?.name,
    averageRating,
    reviewCount,
    brand: product.brand || "Valuva",
  });

  return (
    <>
      {/* Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />

      {/* Breadcrumbs */}
      <div className="container-luxury pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
            {
              name: product.category?.name || "Products",
              url: `/shop?categoryId=${product.category?.id || ""}`,
            },
            ...(product.subCategory
              ? [
                  {
                    name: product.subCategory.name,
                    url: `/shop?categoryId=${
                      product.category?.id || ""
                    }&subCategoryId=${product.subCategory.id}`,
                  },
                ]
              : []),
            { name: product.name, url: productUrl, isBold: true },
          ]}
          showMoreBy={product.brand || undefined}
        />
      </div>

      <div className="min-h-screen bg-[#fafafa]">
        {/* Product Details */}
        <section className="bg-white border-b border-[#e5e5e5]">
          <div className="container-luxury py-6 sm:py-8 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-square border border-[#e5e5e5] overflow-hidden bg-[#fafafa] mb-3 rounded-[20px] cursor-pointer relative group"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      {product.images[selectedImage]?.url ? (
                        <ProductImageZoom
                          src={product.images[selectedImage].url}
                          alt={
                            product.images[selectedImage].altText ||
                            product.name
                          }
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                          <span className="text-neutral-400 text-sm font-medium">
                            No Image Available
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-[20px]" />
                </motion.div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 sm:gap-3">
                  <AnimatePresence>
                    {product.images.map((image, index) => (
                      <motion.button
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square border overflow-hidden transition-all rounded-[12px] relative ${
                          selectedImage === index
                            ? "border-[#0a0a0a] ring-2 ring-[#0a0a0a] ring-offset-2"
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
                        {selectedImage === index && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-[#0a0a0a]/10"
                          />
                        )}
                      </motion.button>
                    ))}
                  </AnimatePresence>
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
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-normal text-[#0a0a0a]"
                  >
                    {product.name}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-baseline gap-4"
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0a0a0a]">
                      {formatPrice(product.basePrice)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm sm:text-base text-neutral-500 line-through font-medium">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </motion.div>
                  {product.reviewCount && product.reviewCount! > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4 fill-[#0a0a0a] text-[#0a0a0a]" />
                      <span className="text-sm font-medium text-[#0a0a0a]">
                        {product.averageRating?.toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        ({product.reviewCount}{" "}
                        {product.reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Short Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {product.shortDescription ? (
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                      {product.shortDescription}
                    </p>
                  ) : (
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                      {product.description}
                    </p>
                  )}
                </motion.div>

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="block text-xs font-medium tracking-normal text-[#0a0a0a]">
                        Size
                      </label>
                      <SizeGuide
                        product={product}
                        selectedSize={selectedSize}
                        onSizeSelect={setSelectedSize}
                        variant="button"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {availableSizes.map((size, index) => {
                          const variant = product.variants.find(
                            (v) => v.size === size && v.color === selectedColor
                          );
                          const isOutOfStock = variant
                            ? variant.stock === 0
                            : false;
                          return (
                            <motion.button
                              key={size}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => setSelectedSize(size)}
                              disabled={isOutOfStock}
                              aria-label={`Select size ${size}${
                                isOutOfStock ? " (out of stock)" : ""
                              }`}
                              aria-pressed={selectedSize === size}
                              className={`px-4 py-2.5 border text-xs sm:text-sm font-medium tracking-normal transition-all rounded-[12px] relative focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                                selectedSize === size
                                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                                  : isOutOfStock
                                  ? "border-[#e5e5e5] text-neutral-400 cursor-not-allowed opacity-50"
                                  : "border-[#e5e5e5] hover:border-[#0a0a0a] text-[#0a0a0a]"
                              }`}
                            >
                              {size}
                              {selectedSize === size && (
                                <motion.div
                                  layoutId="sizeIndicator"
                                  className="absolute inset-0 border-2 border-[#0a0a0a] rounded-[12px]"
                                  transition={{ type: "spring", bounce: 0.2 }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-xs font-medium tracking-normal mb-2.5 text-[#0a0a0a]">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {availableColors.map((color, index) => {
                          const variant = product.variants.find(
                            (v) => v.color === color && v.size === selectedSize
                          );
                          const isOutOfStock = variant
                            ? variant.stock === 0
                            : false;
                          return (
                            <motion.button
                              key={color}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => setSelectedColor(color)}
                              disabled={isOutOfStock}
                              className={`px-4 py-2.5 border text-xs sm:text-sm font-medium tracking-normal transition-all flex items-center gap-2 rounded-[12px] relative ${
                                selectedColor === color
                                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                                  : isOutOfStock
                                  ? "border-[#e5e5e5] text-neutral-400 cursor-not-allowed opacity-50"
                                  : "border-[#e5e5e5] hover:border-[#0a0a0a] text-[#0a0a0a]"
                              }`}
                            >
                              {variant?.colorHex && (
                                <span
                                  className="w-4 h-4 border border-[#e5e5e5] rounded-[6px] flex-shrink-0"
                                  style={{ backgroundColor: variant.colorHex }}
                                />
                              )}
                              {color}
                              {selectedColor === color && (
                                <motion.div
                                  layoutId="colorIndicator"
                                  className="absolute inset-0 border-2 border-[#0a0a0a] rounded-[12px]"
                                  transition={{ type: "spring", bounce: 0.2 }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* Quantity */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="block text-xs font-medium tracking-normal mb-2.5 text-[#0a0a0a]">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-11 sm:h-11 border border-[#e5e5e5] flex items-center justify-center hover:border-[#0a0a0a] hover:bg-[#fafafa] transition-all rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-base sm:text-lg font-medium w-12 text-center text-[#0a0a0a]">
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
                      className="w-10 h-10 sm:w-11 sm:h-11 border border-[#e5e5e5] flex items-center justify-center hover:border-[#0a0a0a] hover:bg-[#fafafa] transition-all rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        quantity >=
                        (selectedVariant?.stock || product.totalStock)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <Button
                    size="lg"
                    variant="filled"
                    className="flex-1 rounded-[16px] gap-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2"
                    onClick={handleAddToCart}
                    disabled={
                      !selectedSize ||
                      !selectedColor ||
                      !selectedVariant ||
                      addToCart.isPending ||
                      (selectedVariant && selectedVariant.stock === 0)
                    }
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {addToCart.isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="rounded-[16px] px-4 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2"
                    aria-label={
                      isInWishlist
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isInWishlist
                          ? "fill-[#0a0a0a] text-[#0a0a0a]"
                          : "text-[#0a0a0a]"
                      }`}
                    />
                  </Button>
                  <ShareButtons
                    url={
                      typeof window !== "undefined" ? window.location.href : ""
                    }
                    title={product.name}
                    description={
                      product.shortDescription || product.description
                    }
                    image={productImage}
                  />
                </motion.div>

                {selectedVariant && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="flex items-center gap-2"
                  >
                    {selectedVariant.stock > 0 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-xs font-medium tracking-normal text-green-600">
                          {selectedVariant.stock} in stock
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-medium tracking-normal text-red-600">
                        Out of stock
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Delivery Options */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <DeliveryOptions
                    productId={product.id}
                    weight={undefined}
                    dimensions={undefined}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Product Details, Material & Care, Specifications */}
        <section className="bg-white border-t border-[#e5e5e5]">
          <div className="container-luxury py-6 sm:py-8 lg:py-10">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-2 mb-6 sm:mb-8 border-b border-[#e5e5e5]"
            >
              <button
                onClick={() => setActiveTab("description")}
                role="tab"
                aria-selected={activeTab === "description"}
                aria-controls="description-panel"
                id="description-tab"
                className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                  activeTab === "description"
                    ? "border-[#0a0a0a] text-[#0a0a0a]"
                    : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                }`}
              >
                Product Details
              </button>
              {product.specifications && (
                <button
                  onClick={() => setActiveTab("specs")}
                  role="tab"
                  aria-selected={activeTab === "specs"}
                  aria-controls="specs-panel"
                  id="specs-tab"
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                    activeTab === "specs"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Package
                    className="h-3.5 w-3.5 inline mr-1.5"
                    aria-hidden="true"
                  />
                  Specifications
                </button>
              )}
              {(product.washCareInstructions ||
                product.careInstructions ||
                product.material) && (
                <button
                  onClick={() => setActiveTab("care")}
                  role="tab"
                  aria-selected={activeTab === "care"}
                  aria-controls="care-panel"
                  id="care-tab"
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                    activeTab === "care"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Info
                    className="h-3.5 w-3.5 inline mr-1.5"
                    aria-hidden="true"
                  />
                  Material & Care
                </button>
              )}
              {(product.shippingInfo || product.sizeGuide) && (
                <button
                  onClick={() => setActiveTab("shipping")}
                  role="tab"
                  aria-selected={activeTab === "shipping"}
                  aria-controls="shipping-panel"
                  id="shipping-tab"
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                    activeTab === "shipping"
                      ? "border-[#0a0a0a] text-[#0a0a0a]"
                      : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
                  }`}
                >
                  <Truck
                    className="h-3.5 w-3.5 inline mr-1.5"
                    aria-hidden="true"
                  />
                  Shipping & Size
                </button>
              )}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="max-w-3xl"
              role="tabpanel"
              aria-labelledby={`${activeTab}-tab`}
            >
              {activeTab === "description" && (
                <div className="space-y-4" id="description-panel">
                  {product.longDescription ? (
                    <div
                      className="text-sm text-neutral-700 leading-relaxed font-medium prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: product.longDescription.replace(
                          /\n/g,
                          "<br />"
                        ),
                      }}
                    />
                  ) : (
                    <div className="text-sm text-neutral-700 leading-relaxed font-medium">
                      {product.description || product.shortDescription}
                    </div>
                  )}
                  {/* Additional Product Details */}
                  <div className="border-t border-[#e5e5e5] pt-4 mt-4 space-y-3">
                    {product.brand && (
                      <div className="flex gap-4">
                        <span className="text-xs font-medium w-24 text-neutral-600">
                          Brand:
                        </span>
                        <span className="text-sm font-medium text-[#0a0a0a]">
                          {product.brand}
                        </span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex gap-4">
                        <span className="text-xs font-medium w-24 text-neutral-600">
                          Category:
                        </span>
                        <span className="text-sm font-medium text-[#0a0a0a]">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex gap-4">
                        <span className="text-xs font-medium w-24 text-neutral-600">
                          SKU:
                        </span>
                        <span className="text-sm font-medium text-[#0a0a0a]">
                          {product.sku}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "specs" && product.specifications && (
                <div className="space-y-3" id="specs-panel">
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

              {activeTab === "care" && (
                <div className="space-y-4" id="care-panel">
                  {product.material && (
                    <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-5">
                      <h3 className="text-sm font-medium mb-3 text-[#0a0a0a]">
                        Material
                      </h3>
                      <div className="text-sm text-neutral-700 leading-relaxed font-medium">
                        {product.material}
                      </div>
                    </div>
                  )}
                  {(product.washCareInstructions ||
                    product.careInstructions) && (
                    <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-5">
                      <h3 className="text-sm font-medium mb-3 text-[#0a0a0a]">
                        Care Instructions
                      </h3>
                      <div className="text-sm text-neutral-700 leading-relaxed font-medium whitespace-pre-line">
                        {product.washCareInstructions ||
                          product.careInstructions}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-6" id="shipping-panel">
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
                    <SizeGuide
                      product={product}
                      selectedSize={selectedSize}
                      onSizeSelect={setSelectedSize}
                      variant="inline"
                    />
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="section-padding bg-white border-t border-[#e5e5e5]">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProductReviews productId={product.id} />
            </motion.div>
          </div>
        </section>

        {/* Product Recommendations */}
        <section className="section-padding bg-[#fafafa] border-t border-[#e5e5e5]">
          <div className="container-luxury">
            <ProductRecommendations productId={product.id} />
          </div>
        </section>

        {/* Related Products */}
        {relatedData && relatedData.data.length > 0 && (
          <section className="section-padding bg-white border-t border-[#e5e5e5]">
            <div className="container-luxury">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-1">
                      You May Also Like
                    </h2>
                    <p className="text-sm text-neutral-500 font-medium">
                      Similar products you might enjoy
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#0a0a0a] transition-colors"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                >
                  <AnimatePresence>
                    {relatedData.data.map((relatedProduct, index) => (
                      <motion.div
                        key={relatedProduct.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <ProductCard product={relatedProduct} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
