"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * Optimized Image Component
 * - Lazy loading by default
 * - WebP support
 * - Placeholder while loading
 * - Error handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  priority = false,
  sizes,
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`bg-[#fafafa] flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-xs text-neutral-400 font-medium">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={fill ? undefined : { width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#fafafa] animate-pulse rounded-[12px]" />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        quality={85}
      />
    </div>
  );
}

