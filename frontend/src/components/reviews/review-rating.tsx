"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ReviewRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ReviewRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: ReviewRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        const isFilled = value <= displayRating;

        return (
          <motion.button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHoveredRating(value)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            className={`${sizeClasses[size]} transition-all duration-200 ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.95 } : {}}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-neutral-300"
              } transition-colors duration-200`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

