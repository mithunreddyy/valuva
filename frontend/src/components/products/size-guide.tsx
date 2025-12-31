"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product, ProductVariant } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, Ruler } from "lucide-react";
import { useMemo, useState } from "react";

interface SizeGuideProps {
  product: Product;
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
  variant?: "button" | "inline" | "modal";
}

/**
 * Size Guide Component
 * Displays product size measurements with availability indicators
 * Works dynamically with or without size availability data
 */
export function SizeGuide({
  product,
  selectedSize,
  onSizeSelect,
  variant = "modal",
}: SizeGuideProps) {
  const sizeGuide = product.sizeGuide;
  const variants = useMemo(() => product.variants || [], [product.variants]);

  // Get all unique sizes from variants
  const availableSizes = useMemo(() => {
    return Array.from(new Set(variants.map((v) => v.size))).sort();
  }, [variants]);

  // Create size availability map
  const sizeAvailability = useMemo(() => {
    const availability: Record<
      string,
      { inStock: boolean; stock: number; variants: ProductVariant[] }
    > = {};

    availableSizes.forEach((size) => {
      const sizeVariants = variants.filter((v) => v.size === size);
      const totalStock = sizeVariants.reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      );
      availability[size] = {
        inStock: totalStock > 0,
        stock: totalStock,
        variants: sizeVariants,
      };
    });

    return availability;
  }, [availableSizes, variants]);

  // Unit toggle state (inches/cm)
  const [unit, setUnit] = useState<"in" | "cm">("in");
  // Tab state for Size Chart / How to Measure
  const [activeTab, setActiveTab] = useState<"sizeChart" | "howToMeasure">(
    "sizeChart"
  );

  // Standard measurement fields based on reference images
  const standardFields = useMemo(
    () => [
      { key: "chest", label: "Chest" },
      { key: "frontLength", label: "Front Length" },
      { key: "waist", label: "Waist" },
      { key: "acrossShoulder", label: "Across Shoulder" },
      { key: "sleeveLength", label: "Sleeve Length" },
      { key: "collar", label: "Collar" },
    ],
    []
  );

  // Extract measurement fields that have data
  const measurementFields = useMemo(() => {
    if (!sizeGuide?.measurements || sizeGuide.measurements.length === 0) {
      return [];
    }

    // Get fields that have at least one non-empty value
    const fieldsWithData = new Set<string>();
    sizeGuide.measurements.forEach((measurement) => {
      standardFields.forEach((field) => {
        if (measurement[field.key as keyof typeof measurement]) {
          fieldsWithData.add(field.key);
        }
      });
    });

    return standardFields.filter((field) => fieldsWithData.has(field.key));
  }, [sizeGuide, standardFields]);

  // Render size guide content
  const renderSizeGuideContent = () => {
    if (!sizeGuide) {
      return (
        <div className="text-center py-8">
          <Ruler className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
          <p className="text-sm text-neutral-600 font-medium">
            Size guide not available for this product.
          </p>
          {availableSizes.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-neutral-500 mb-2">Available sizes:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableSizes.map((size) => {
                  const availability = sizeAvailability[size];
                  return (
                    <span
                      key={size}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-medium border ${
                        availability?.inStock
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-neutral-200 bg-neutral-50 text-neutral-500"
                      }`}
                    >
                      {size}
                      {availability && (
                        <span className="ml-1">({availability.stock})</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sizeGuide.title && (
          <div className="text-center">
            <h3 className="text-base font-medium text-[#0a0a0a]">
              {sizeGuide.title}
            </h3>
          </div>
        )}

        {/* Tabs for Size Chart and How to Measure */}
        <div className="flex gap-2 border-b border-[#e5e5e5]">
          <button
            type="button"
            onClick={() => setActiveTab("sizeChart")}
            className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
              activeTab === "sizeChart"
                ? "border-[#0a0a0a] text-[#0a0a0a]"
                : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
            }`}
          >
            Size Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("howToMeasure")}
            className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
              activeTab === "howToMeasure"
                ? "border-[#0a0a0a] text-[#0a0a0a]"
                : "border-transparent text-neutral-600 hover:text-[#0a0a0a]"
            }`}
          >
            How to measure
          </button>
        </div>

        {/* Size Chart Tab Content */}
        {activeTab === "sizeChart" &&
          sizeGuide.measurements &&
          sizeGuide.measurements.length > 0 && (
            <div className="space-y-4">
              {/* Unit Toggle */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-neutral-600 font-medium">
                  Unit:
                </span>
                <div className="flex border border-[#e5e5e5] rounded-[8px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setUnit("in")}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      unit === "in"
                        ? "bg-[#0a0a0a] text-[#fafafa]"
                        : "bg-white text-neutral-600 hover:bg-[#fafafa]"
                    }`}
                  >
                    in
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("cm")}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-[#e5e5e5] ${
                      unit === "cm"
                        ? "bg-[#0a0a0a] text-[#fafafa]"
                        : "bg-white text-neutral-600 hover:bg-[#fafafa]"
                    }`}
                  >
                    cm
                  </button>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a] sticky left-0 bg-[#fafafa] z-10">
                          Size
                        </th>
                        {sizeGuide.measurements?.some((m) => m.brandSize) && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a]">
                            Brand Size
                          </th>
                        )}
                        {measurementFields.map((field) => (
                          <th
                            key={field.key}
                            className="px-4 py-3 text-left text-xs font-medium text-[#0a0a0a] whitespace-nowrap"
                          >
                            {field.label} ({unit})
                          </th>
                        ))}
                        {availableSizes.length > 0 && (
                          <th className="px-4 py-3 text-center text-xs font-medium text-[#0a0a0a]">
                            Availability
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {sizeGuide.measurements.map((measurement, index) => {
                          const size = measurement.size;
                          const availability = sizeAvailability[size];
                          const isSelected = selectedSize === size;

                          // Convert inches to cm if needed (1 inch = 2.54 cm)
                          const convertValue = (
                            value: string | undefined
                          ): string => {
                            if (!value) return "-";
                            if (unit === "cm") {
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue)) {
                                return (numValue * 2.54).toFixed(1);
                              }
                            }
                            return value;
                          };

                          return (
                            <motion.tr
                              key={size}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ delay: index * 0.05 }}
                              className={`border-b border-[#e5e5e5] last:border-0 transition-colors ${
                                isSelected
                                  ? "bg-[#fafafa]"
                                  : "hover:bg-[#fafafa]/50"
                              } ${onSizeSelect ? "cursor-pointer" : ""}`}
                              onClick={() => onSizeSelect?.(size)}
                            >
                              <td className="px-4 py-3 font-medium text-[#0a0a0a] sticky left-0 bg-white z-10">
                                <div className="flex items-center gap-2">
                                  <span>{size}</span>
                                  {isSelected && (
                                    <CheckCircle className="h-4 w-4 text-[#0a0a0a]" />
                                  )}
                                </div>
                              </td>
                              {sizeGuide.measurements?.some(
                                (m) => m.brandSize
                              ) && (
                                <td className="px-4 py-3 text-neutral-600 font-medium">
                                  {measurement.brandSize || measurement.size}
                                </td>
                              )}
                              {measurementFields.map((field) => (
                                <td
                                  key={field.key}
                                  className="px-4 py-3 text-neutral-600 font-medium whitespace-nowrap"
                                >
                                  {convertValue(
                                    measurement[
                                      field.key as keyof typeof measurement
                                    ] as string | undefined
                                  )}
                                </td>
                              ))}
                              {availableSizes.length > 0 && (
                                <td className="px-4 py-3 text-center">
                                  {availability ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      {availability.inStock ? (
                                        <>
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                          <span className="text-xs font-medium text-green-600">
                                            {availability.stock} in stock
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-xs font-medium text-red-600">
                                          Out of stock
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-neutral-400">
                                      N/A
                                    </span>
                                  )}
                                </td>
                              )}
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        {/* How to Measure Tab Content */}
        {activeTab === "howToMeasure" && (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-sm font-medium text-[#0a0a0a] mb-1">
                How to measure yourself
              </h4>
              <p className="text-xs text-neutral-500">
                * Garment Measurements in{" "}
                {unit === "in" ? "Inches" : "Centimeters"}
              </p>
            </div>

            {/* Measurement Diagram */}
            <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-6">
              <div className="relative max-w-md mx-auto">
                {/* T-shirt outline SVG */}
                <svg
                  viewBox="0 0 200 300"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* T-shirt outline */}
                  <path
                    d="M 50 30 Q 50 20 60 20 L 80 20 Q 90 20 100 30 L 100 50 Q 100 60 110 60 L 140 60 Q 150 60 150 50 L 150 30 Q 150 20 160 20 L 180 20 Q 190 20 190 30 L 190 80 Q 190 90 180 90 L 160 90 L 160 280 Q 160 290 150 290 L 100 290 Q 90 290 90 280 L 90 90 L 70 90 Q 60 90 60 80 L 60 30 Q 60 20 50 30 Z"
                    fill="none"
                    stroke="#0a0a0a"
                    strokeWidth="2"
                    className="opacity-30"
                  />

                  {/* Collar measurement */}
                  <g>
                    <path
                      d="M 70 40 Q 100 35 130 40"
                      stroke="#22c55e"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                    />
                    <circle cx="70" cy="40" r="3" fill="#22c55e" />
                    <circle cx="130" cy="40" r="3" fill="#22c55e" />
                    <text
                      x="100"
                      y="30"
                      textAnchor="middle"
                      className="text-[10px] fill-[#22c55e] font-medium"
                    >
                      Collar
                    </text>
                  </g>

                  {/* Across Shoulder measurement */}
                  <g>
                    <line
                      x1="80"
                      y1="60"
                      x2="150"
                      y2="60"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <circle cx="80" cy="60" r="3" fill="#3b82f6" />
                    <circle cx="150" cy="60" r="3" fill="#3b82f6" />
                    <text
                      x="115"
                      y="55"
                      textAnchor="middle"
                      className="text-[10px] fill-[#3b82f6] font-medium"
                    >
                      Across Shoulder
                    </text>
                  </g>

                  {/* Sleeve Length measurement */}
                  <g>
                    <path
                      d="M 150 60 L 190 100"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                    />
                    <circle cx="150" cy="60" r="3" fill="#8b5cf6" />
                    <circle cx="190" cy="100" r="3" fill="#8b5cf6" />
                    <text
                      x="175"
                      y="75"
                      textAnchor="middle"
                      className="text-[10px] fill-[#8b5cf6] font-medium"
                    >
                      Sleeve Length
                    </text>
                  </g>

                  {/* Chest measurement */}
                  <g>
                    <ellipse
                      cx="115"
                      cy="120"
                      rx="40"
                      ry="15"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="115"
                      y="110"
                      textAnchor="middle"
                      className="text-[10px] fill-[#ef4444] font-medium"
                    >
                      Chest
                    </text>
                  </g>

                  {/* Waist measurement */}
                  <g>
                    <ellipse
                      cx="115"
                      cy="160"
                      rx="35"
                      ry="12"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="115"
                      y="150"
                      textAnchor="middle"
                      className="text-[10px] fill-[#f59e0b] font-medium"
                    >
                      Waist
                    </text>
                  </g>

                  {/* Length measurement */}
                  <g>
                    <line
                      x1="100"
                      y1="40"
                      x2="100"
                      y2="280"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <circle cx="100" cy="40" r="3" fill="#06b6d4" />
                    <circle cx="100" cy="280" r="3" fill="#06b6d4" />
                    <text
                      x="85"
                      y="160"
                      textAnchor="middle"
                      className="text-[10px] fill-[#06b6d4] font-medium"
                      transform="rotate(-90 85 160)"
                    >
                      Length
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Measurement Instructions */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-4">
                  <h5 className="text-xs font-medium text-[#0a0a0a] mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Collar
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Measure around the neck opening where the collar sits.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-4">
                  <h5 className="text-xs font-medium text-[#0a0a0a] mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Across Shoulder
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Measure from one shoulder seam to the other across the back.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-4">
                  <h5 className="text-xs font-medium text-[#0a0a0a] mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Sleeve Length
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Measure from the shoulder seam down to the sleeve hem.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-4">
                  <h5 className="text-xs font-medium text-[#0a0a0a] mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    Chest
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Measure around the fullest part of the chest, just below the
                    armholes.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-4">
                  <h5 className="text-xs font-medium text-[#0a0a0a] mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    Waist
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Measure around the natural waistline, typically the
                    narrowest part of the torso.
                  </p>
                </div>

                <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-4">
                  <h5 className="text-xs font-medium text-[#0a0a0a] mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                    Front Length
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Measure from the highest point of the shoulder (near collar)
                    down to the bottom hem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sizeChart" &&
          (!sizeGuide.measurements || sizeGuide.measurements.length === 0) && (
            <div className="text-center py-6">
              <p className="text-sm text-neutral-600 font-medium">
                No measurement data available.
              </p>
            </div>
          )}

        {sizeGuide.notes && (
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-neutral-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                {sizeGuide.notes}
              </p>
            </div>
          </div>
        )}

        {availableSizes.length > 0 && !sizeGuide.measurements && (
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] p-4">
            <p className="text-xs font-medium text-[#0a0a0a] mb-2">
              Available Sizes:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const availability = sizeAvailability[size];
                return (
                  <button
                    key={size}
                    onClick={() => onSizeSelect?.(size)}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                        : availability?.inStock
                        ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300"
                        : "border-neutral-200 bg-neutral-50 text-neutral-500"
                    }`}
                  >
                    {size}
                    {availability && (
                      <span className="ml-1">({availability.stock})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render as button with modal
  if (variant === "button" || variant === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[12px] h-9 text-xs font-medium gap-2"
            aria-label="View size guide"
          >
            <Ruler className="h-3.5 w-3.5" />
            Size Guide
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Size Guide - {product.name}
            </DialogTitle>
            <DialogDescription>
              Select a size to see measurements and availability
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">{renderSizeGuideContent()}</div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render inline
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="h-4 w-4 text-[#0a0a0a]" />
        <h3 className="text-base font-medium text-[#0a0a0a]">
          Size Guide
          {sizeGuide?.title && ` - ${sizeGuide.title}`}
        </h3>
      </div>
      {renderSizeGuideContent()}
    </div>
  );
}
