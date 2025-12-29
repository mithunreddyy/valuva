"use client";

import { StockAlert } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface StockAlertCardProps {
  alert: StockAlert;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function StockAlertCard({
  alert,
  onDelete,
  isDeleting = false,
}: StockAlertCardProps) {
  const productImage =
    alert.product?.images?.find((img) => img.isPrimary)?.url ||
    alert.product?.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 hover:border-[#0a0a0a] transition-all duration-300"
    >
      {alert.product ? (
        <Link href={`/products/${alert.product.slug}`}>
          <div className="flex items-start gap-4 mb-4">
            {productImage ? (
              <div className="relative w-20 h-20 rounded-[12px] overflow-hidden bg-[#fafafa] border border-[#e5e5e5] flex-shrink-0">
                <Image
                  src={productImage}
                  alt={alert.product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                <Package className="h-8 w-8 text-neutral-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium tracking-normal text-[#0a0a0a] mb-1 line-clamp-2">
                {alert.product.name}
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Added {formatDate(alert.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-neutral-400" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-normal text-[#0a0a0a]">
              Product Alert
            </p>
            <p className="text-xs text-neutral-500 font-medium">
              Added {formatDate(alert.createdAt)}
            </p>
          </div>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
        disabled={isDeleting}
        className="w-full rounded-[10px] border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {isDeleting ? "Removing..." : "Remove Alert"}
      </Button>
    </motion.div>
  );
}

