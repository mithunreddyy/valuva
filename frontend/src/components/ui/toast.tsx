"use client";

import { useToastStore } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pointer-events-auto"
          >
            <div
              className={cn(
                "relative flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
                toast.variant === "destructive"
                  ? "border-red-500 bg-red-50/90"
                  : "border-neutral-200 bg-white/90"
              )}
            >
              <div className="flex-1">
                {toast.title && (
                  <div className="font-semibold text-sm">{toast.title}</div>
                )}
                {toast.description && (
                  <div className="text-sm text-neutral-600 mt-1">
                    {toast.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="rounded-full p-1 hover:bg-black/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
