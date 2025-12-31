"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import axios, { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, MapPin, Truck, X } from "lucide-react";
import { useState } from "react";

interface DeliveryOptionsProps {
  productId: string;
  weight?: number | null; // in kg
  dimensions?: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
  } | null;
}

interface DeliveryInfo {
  available: boolean;
  rate?: number;
  estimatedDays?: number;
  carrier?: string;
  service?: string;
  message?: string;
}

export function DeliveryOptions({ weight, dimensions }: DeliveryOptionsProps) {
  // Default weight to 0.5kg if not provided
  const productWeight = weight || 0.5;

  // Only include dimensions if all values are present
  const productDimensions =
    dimensions && dimensions.length && dimensions.width && dimensions.height
      ? {
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
        }
      : undefined;
  const [pincode, setPincode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckDelivery = async () => {
    if (!pincode || pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsChecking(true);
    setError(null);
    setDeliveryInfo(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${API_URL}/api/v1/shipping/check-delivery`,
        {
          pincode,
          weight: productWeight,
          dimensions: productDimensions,
        }
      );

      if (response.data.success) {
        setDeliveryInfo(response.data.data);
      } else {
        setError(
          response.data.message || "Unable to check delivery availability"
        );
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message ||
          (error.message as string) ||
          "Unable to check delivery availability. Please try again."
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handlePincodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setPincode(numericValue);
    setError(null);
    setDeliveryInfo(null);
  };

  return (
    <div className="border border-[#e5e5e5] rounded-[12px] p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-4 w-4 text-[#0a0a0a]" />
        <h3 className="text-sm font-medium text-[#0a0a0a]">
          Check Delivery Availability
        </h3>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCheckDelivery();
              }
            }}
            maxLength={6}
            className="pl-10 rounded-[8px] h-10 text-sm"
            disabled={isChecking}
          />
        </div>
        <Button
          onClick={handleCheckDelivery}
          disabled={isChecking || !pincode || pincode.length !== 6}
          className="rounded-[8px] h-10 px-4 text-xs font-medium"
          variant="filled"
        >
          {isChecking ? (
            <>
              <LoadingSpinner size="sm" />
              Checking...
            </>
          ) : (
            "Check"
          )}
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-[8px] p-2.5"
        >
          <X className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {deliveryInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`border rounded-[8px] p-3.5 space-y-2 ${
              deliveryInfo.available
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {deliveryInfo.available ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-green-700">
                    Delivery Available
                  </span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-red-700">
                    Delivery Not Available
                  </span>
                </>
              )}
            </div>

            {deliveryInfo.available && (
              <div className="space-y-1.5 pl-6">
                {deliveryInfo.rate !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">
                      Shipping Cost:
                    </span>
                    <span className="text-xs font-medium text-green-700">
                      ₹{deliveryInfo.rate.toFixed(2)}
                    </span>
                  </div>
                )}
                {deliveryInfo.estimatedDays !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">
                      Estimated Delivery:
                    </span>
                    <span className="text-xs font-medium text-green-700">
                      {deliveryInfo.estimatedDays} day
                      {deliveryInfo.estimatedDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {deliveryInfo.carrier && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">Carrier:</span>
                    <span className="text-xs font-medium text-green-700">
                      {deliveryInfo.carrier}
                    </span>
                  </div>
                )}
              </div>
            )}

            {deliveryInfo.message && (
              <p className="text-xs text-neutral-600 pl-6 mt-1">
                {deliveryInfo.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
