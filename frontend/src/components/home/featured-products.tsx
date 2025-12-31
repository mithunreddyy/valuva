"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { useProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts({
    isFeatured: true,
    limit: 6,
  });

  if (error) return null;

  const products = data?.data?.slice(0, 2) || [];

  return (
    <section className="section-padding bg-[#fafafa] overflow-hidden">
      <div className="container-luxury">
        <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
          {/* Section Header - Minimal Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
          >
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight text-[#0a0a0a]">
                Featured
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-neutral-500 font-medium tracking-normal">
                Curated Selection
              </p>
            </div>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/shop?isFeatured=true"
                className="flex items-center gap-2 text-sm sm:text-base font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors duration-300 group"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Products Grid - 2 Columns, Large Apple-Style Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
              {Array.from({ length: 2 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
              {products.map((product, index) => (
                <FeaturedProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 sm:py-20 md:py-24"
            >
              <p className="text-base sm:text-lg text-neutral-500 font-medium tracking-normal">
                No featured products available.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

interface FeaturedProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    compareAtPrice?: number;
    images: Array<{ url: string; isPrimary?: boolean }>;
    isNewArrival?: boolean;
  };
  index: number;
}

function FeaturedProductCard({ product, index }: FeaturedProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["7.5deg", "-7.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-7.5deg", "7.5deg"]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block relative bg-white border border-[#e5e5e5] rounded-[32px] overflow-hidden transition-all duration-700 hover:border-[#0a0a0a] hover:shadow-2xl"
      >
        {/* Image Container - Large Aspect Ratio */}
        <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] xl:aspect-[5/6] overflow-hidden bg-[#fafafa]">
          {primaryImage ? (
            <motion.div
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full h-full"
            >
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#fafafa]">
              <span className="text-sm font-medium tracking-normal text-neutral-400">
                {product.name}
              </span>
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.03 : 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"
          />

          {/* Badges */}
          {product.isNewArrival && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
              className="absolute left-6 top-6 sm:left-8 sm:top-8"
            >
              <span className="bg-[#0a0a0a] text-[#fafafa] px-4 py-2 text-xs font-medium tracking-normal rounded-[16px] backdrop-blur-sm">
                New
              </span>
            </motion.div>
          )}
        </div>

        {/* Product Info - Enhanced Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
          className="p-6 sm:p-8 lg:p-10 space-y-4"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight line-clamp-2 text-[#0a0a0a] group-hover:text-neutral-700 transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg sm:text-xl md:text-2xl font-medium text-[#0a0a0a]">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm sm:text-base text-neutral-500 line-through font-medium">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </motion.div>

        {/* Hover Indicator */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-[#0a0a0a] flex items-center justify-center pointer-events-none"
        >
          <ArrowRight className="h-5 w-5 text-white" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
