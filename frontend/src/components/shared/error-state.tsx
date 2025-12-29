"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error. Please try again.",
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium tracking-normal text-[#0a0a0a] mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 font-medium mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="rounded-[10px]"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}

