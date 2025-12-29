"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : `flex items-center justify-center ${sizeClasses[size]}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClasses}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={size} />
        {message && (
          <p className="text-sm font-medium text-neutral-500">{message}</p>
        )}
      </div>
    </motion.div>
  );
}

