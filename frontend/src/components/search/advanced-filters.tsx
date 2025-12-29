"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    brand?: string;
    size?: string;
    color?: string;
  };
  onApply: (filters: {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    brand?: string;
    size?: string;
    color?: string;
  }) => void;
  onReset: () => void;
}

// Production-ready: These will be replaced with API data
// Fallback values for initial render
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = [
  "Black",
  "White",
  "Gray",
  "Navy",
  "Beige",
  "Brown",
  "Red",
  "Blue",
  "Green",
];
const brands = ["VALUVA", "Premium", "Classic", "Modern"];

export function AdvancedFilters({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const { data: filterOptions } = useFilterOptions();

  // Production-ready: Use real filter options from API, fallback to defaults
  const sizes = filterOptions?.sizes || DEFAULT_SIZES;
  const colors =
    filterOptions?.colors ||
    DEFAULT_COLORS.map((c) => ({ name: c, value: c.toLowerCase() }));

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    onClose();
  };

  const updateFilter = (key: string, value: string | number | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] lg:w-[480px] bg-white border-l border-[#e5e5e5] shadow-xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-5 sm:p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                  <Filter className="h-5 w-5 text-[#0a0a0a]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium tracking-normal text-[#0a0a0a]">
                  Filters
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center hover:bg-[#fafafa] rounded-[12px] transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#0a0a0a]">
                  Price Range
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 font-medium mb-1.5">
                      Min Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={localFilters.minPrice || ""}
                      onChange={(e) =>
                        updateFilter(
                          "minPrice",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="rounded-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 font-medium mb-1.5">
                      Max Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={localFilters.maxPrice || ""}
                      onChange={(e) =>
                        updateFilter(
                          "maxPrice",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="rounded-[12px]"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#0a0a0a]">
                  Minimum Rating
                </h3>
                <Select
                  value={localFilters.minRating?.toString() || ""}
                  onValueChange={(value) =>
                    updateFilter("minRating", value ? Number(value) : undefined)
                  }
                >
                  <SelectTrigger className="rounded-[12px]">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#0a0a0a]">Brand</h3>
                <Select
                  value={localFilters.brand || ""}
                  onValueChange={(value) =>
                    updateFilter("brand", value || undefined)
                  }
                >
                  <SelectTrigger className="rounded-[12px]">
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#0a0a0a]">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        updateFilter(
                          "size",
                          localFilters.size === size ? undefined : size
                        )
                      }
                      className={`px-4 py-2 text-xs font-medium tracking-normal rounded-[12px] transition-all ${
                        localFilters.size === size
                          ? "bg-[#0a0a0a] text-[#fafafa]"
                          : "bg-[#fafafa] text-[#0a0a0a] border border-[#e5e5e5] hover:border-[#0a0a0a]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#0a0a0a]">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const colorValue =
                      typeof color === "string" ? color : color.value;
                    const colorName =
                      typeof color === "string" ? color : color.name;
                    return (
                      <button
                        key={colorValue}
                        onClick={() =>
                          updateFilter(
                            "color",
                            localFilters.color === colorValue
                              ? undefined
                              : colorValue
                          )
                        }
                        className={`px-4 py-2 text-xs font-medium tracking-normal rounded-[12px] transition-all ${
                          localFilters.color === colorValue
                            ? "bg-[#0a0a0a] text-[#fafafa]"
                            : "bg-[#fafafa] text-[#0a0a0a] border border-[#e5e5e5] hover:border-[#0a0a0a]"
                        }`}
                      >
                        {colorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] p-5 sm:p-6 flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 rounded-[16px]"
              >
                Reset
              </Button>
              <Button
                variant="filled"
                onClick={handleApply}
                className="flex-1 rounded-[16px]"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
