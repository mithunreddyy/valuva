"use client";

import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImageZoom({
  src,
  alt,
  className = "",
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return (
    <div
      className={`relative group cursor-zoom-in ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={{
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
          priority
        />
      </div>
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm border border-[#e5e5e5] rounded-[8px] p-2">
          <ZoomIn className="h-4 w-4 text-[#0a0a0a]" />
        </div>
      </div>
    </div>
  );
}

interface ProductImageModalProps {
  images: Array<{ id: string; url: string; altText?: string }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function ProductImageModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  productName,
}: ProductImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-[#e5e5e5] rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="h-5 w-5 text-[#0a0a0a]" />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-[#e5e5e5] rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg
              className="h-6 w-6 text-[#0a0a0a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Image */}
        <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productName}
            width={1200}
            height={1200}
            className="object-contain w-full h-full max-h-[90vh] rounded-[12px]"
            priority
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-[#e5e5e5] rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg
              className="h-6 w-6 text-[#0a0a0a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded-[8px] overflow-hidden transition-all ${
                  currentIndex === index
                    ? "border-[#0a0a0a]"
                    : "border-white/50 hover:border-white"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${productName} - Image ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-[#e5e5e5] rounded-[8px] px-3 py-1.5">
            <span className="text-xs font-medium text-[#0a0a0a]">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

