"use client";

import { useOfflineStatus } from "@/lib/offline.util";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

/**
 * Offline Indicator Component
 * Shows when user is offline and queues requests
 */
export function OfflineIndicator() {
  const isOffline = useOfflineStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium"
        >
          <div className="container-luxury flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>You&apos;re offline. Your actions will be saved and synced when you&apos;re back online.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

