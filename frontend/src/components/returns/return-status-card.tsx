"use client";

import { ReturnRequest } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface ReturnStatusCardProps {
  returnRequest: ReturnRequest;
  onClick?: () => void;
}

export function ReturnStatusCard({
  returnRequest,
  onClick,
}: ReturnStatusCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "COMPLETED":
        return {
          icon: CheckCircle,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "PROCESSING":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-neutral-600",
          bgColor: "bg-neutral-50",
          borderColor: "border-neutral-200",
        };
    }
  };

  const statusConfig = getStatusConfig(returnRequest.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-[#e5e5e5] rounded-[20px] p-6 hover:border-[#0a0a0a] transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor} flex items-center justify-center flex-shrink-0`}
            >
              <Package className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              {returnRequest.order && (
                <h3 className="text-base font-medium tracking-normal text-[#0a0a0a] mb-1">
                  Order #{returnRequest.order.orderNumber}
                </h3>
              )}
              <p className="text-sm text-neutral-600 font-medium mb-2">
                {returnRequest.reason}
              </p>
              {returnRequest.description && (
                <p className="text-xs text-neutral-500 font-medium line-clamp-2 mb-2">
                  {returnRequest.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                <span>{returnRequest.orderItemIds.length} item(s)</span>
                <span>•</span>
                <span>{formatDate(returnRequest.createdAt)}</span>
              </div>
              {returnRequest.adminNotes && (
                <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
                  <p className="text-xs text-neutral-500 font-medium">
                    <span className="font-semibold">Admin Note:</span>{" "}
                    {returnRequest.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div
            className={`px-3 py-1.5 rounded-[10px] ${statusConfig.bgColor} border ${statusConfig.borderColor} flex items-center gap-1.5`}
          >
            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
            <span
              className={`text-xs font-medium tracking-normal capitalize ${statusConfig.color}`}
            >
              {returnRequest.status}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

