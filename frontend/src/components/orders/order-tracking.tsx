"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useOrderTracking } from "@/hooks/use-tracking";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react";

interface OrderTrackingProps {
  orderNumber: string;
}

export function OrderTracking({ orderNumber }: OrderTrackingProps) {
  const { data, isLoading, error } = useOrderTracking(orderNumber);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-medium text-neutral-500">
          Unable to load tracking information
        </p>
      </div>
    );
  }

  const tracking = data.data;

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "PROCESSING":
        return <Package className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
        <div className="flex items-center gap-4 mb-4">
          {getStatusIcon(tracking.status)}
          <div>
            <h3 className="text-lg font-medium tracking-normal">
              Current Status
            </h3>
            <p className="text-sm text-neutral-500 font-medium">
              {tracking.status}
            </p>
          </div>
        </div>
        {tracking.estimatedDelivery && (
          <div className="flex items-center gap-2 text-sm text-neutral-600 font-medium">
            <Clock className="h-4 w-4" />
            <span>
              Estimated delivery: {formatDate(tracking.estimatedDelivery)}
            </span>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      {tracking.events && tracking.events.length > 0 && (
        <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px]">
          <h3 className="text-lg font-medium tracking-normal mb-6">
            Tracking History
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#e5e5e5]"></div>
            <div className="space-y-6">
              {tracking.events.map((event) => (
                <div key={event.id} className="relative flex gap-4">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0a0a0a] flex items-center justify-center">
                      {getStatusIcon(event.status)}
                    </div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium tracking-normal">
                          {event.status}
                        </p>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500 font-medium">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 font-medium">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-neutral-600 font-medium">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
