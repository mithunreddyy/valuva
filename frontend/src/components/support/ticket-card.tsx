"use client";

import { SupportTicket } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface TicketCardProps {
  ticket: SupportTicket;
  onClick?: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "CLOSED":
        return {
          icon: XCircle,
          color: "text-neutral-600",
          bgColor: "bg-neutral-50",
          borderColor: "border-neutral-200",
        };
      case "IN_PROGRESS":
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
    }
  };

  const statusConfig = getStatusConfig(ticket.status);
  const StatusIcon = statusConfig.icon;
  const replyCount = ticket.replies?.length || 0;

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
              <MessageSquare className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium tracking-normal text-[#0a0a0a] mb-1 truncate">
                {ticket.subject}
              </h3>
              <p className="text-sm text-neutral-600 font-medium line-clamp-2 mb-2">
                {ticket.message}
              </p>
              <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                <span className="capitalize">{ticket.category}</span>
                <span>•</span>
                <span>{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                <span>•</span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
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
              {ticket.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

