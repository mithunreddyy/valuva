"use client";

import { Button } from "@/components/ui/button";
import { useReturns } from "@/hooks/use-returns";
import { formatDate } from "@/lib/formatters";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import Link from "next/link";

export default function ReturnsPage() {
  const { returns, isLoading } = useReturns();
  const data = returns;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#e5e5e5] rounded-[16px] p-4 h-28"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container-luxury text-center py-12 space-y-4">
          <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto">
            <Package className="w-6 h-6 text-neutral-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight leading-[0.95]">
            No Returns
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            You haven&apos;t requested any returns yet
          </p>
          <Link href="/dashboard/orders">
            <Button size="sm" variant="filled" className="rounded-[12px]">
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[0.95]">
            Return Requests
          </h1>
        </div>
      </section>

      {/* Returns List */}
      <section className="container-luxury py-6 sm:py-8">
        <div className="space-y-3">
          {data.map((returnRequest) => (
            <div
              key={returnRequest.id}
              className="bg-white border border-[#e5e5e5] rounded-[16px] p-4 hover:border-[#0a0a0a] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {getStatusIcon(returnRequest.status)}
                    <span className="text-xs font-medium capitalize">
                      {returnRequest.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-normal">
                    Requested on {formatDate(returnRequest.createdAt)}
                  </p>
                </div>
                <Link href={`/dashboard/orders/${returnRequest.orderId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-[12px] border-[#e5e5e5] hover:border-[#0a0a0a]"
                  >
                    View Order
                  </Button>
                </Link>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs">
                  <span className="font-medium">Reason:</span>{" "}
                  {returnRequest.reason}
                </p>
                {returnRequest.description && (
                  <p className="text-xs text-neutral-600 font-normal">
                    {returnRequest.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
