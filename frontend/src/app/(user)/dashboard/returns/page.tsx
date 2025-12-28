"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { returnsApi } from "@/services/api/returns";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/formatters";

export default function ReturnsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["returns"],
    queryFn: () => returnsApi.getUserReturns(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-3xl font-medium mb-2">No Returns</h1>
          <p className="text-neutral-500 mb-6">
            You haven&apos;t requested any returns yet
          </p>
          <Link href="/dashboard/orders">
            <Button variant="filled" className="rounded-[10px]">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Return Requests</h1>
        <div className="space-y-4">
          {data.map((returnRequest) => (
            <div
              key={returnRequest.id}
              className="bg-white border border-[#e5e5e5] rounded-[12px] p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(returnRequest.status)}
                    <span className="font-medium capitalize">
                      {returnRequest.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Requested on {formatDate(returnRequest.createdAt)}
                  </p>
                </div>
                <Link href={`/dashboard/orders/${returnRequest.orderId}`}>
                  <Button variant="outline" size="sm" className="rounded-[10px]">
                    View Order
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Reason:</span> {returnRequest.reason}
                </p>
                {returnRequest.description && (
                  <p className="text-sm text-neutral-600">
                    {returnRequest.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

