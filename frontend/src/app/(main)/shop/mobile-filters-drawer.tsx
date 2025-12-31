"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categories";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
}: MobileFiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesData } = useCategories();

  // Local state for filters (to apply changes only when Apply is clicked)
  const [localFilters, setLocalFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    categoryId: searchParams.get("categoryId") || "",
    subCategoryId: searchParams.get("subCategoryId") || "",
    size: searchParams.get("size") || "",
    color: searchParams.get("color") || "",
    isFeatured: searchParams.get("isFeatured") === "true",
    isNewArrival: searchParams.get("isNewArrival") === "true",
  });

  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    size: true,
    color: false,
    features: false,
  });

  // Sync local state with URL params when drawer opens
  useEffect(() => {
    if (!isOpen) return;

    const updateFilters = () => {
      setLocalFilters({
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        categoryId: searchParams.get("categoryId") || "",
        subCategoryId: searchParams.get("subCategoryId") || "",
        size: searchParams.get("size") || "",
        color: searchParams.get("color") || "",
        isFeatured: searchParams.get("isFeatured") === "true",
        isNewArrival: searchParams.get("isNewArrival") === "true",
      });
    };

    // Use requestAnimationFrame to avoid synchronous state updates
    const rafId = requestAnimationFrame(updateFilters);
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, searchParams]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateLocalFilter = (
    key: keyof typeof localFilters,
    value: string | boolean
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (localFilters.minPrice) params.set("minPrice", localFilters.minPrice);
    if (localFilters.maxPrice) params.set("maxPrice", localFilters.maxPrice);
    if (localFilters.categoryId)
      params.set("categoryId", localFilters.categoryId);
    if (localFilters.subCategoryId)
      params.set("subCategoryId", localFilters.subCategoryId);
    if (localFilters.size) params.set("size", localFilters.size);
    if (localFilters.color) params.set("color", localFilters.color);
    if (localFilters.isFeatured) params.set("isFeatured", "true");
    if (localFilters.isNewArrival) params.set("isNewArrival", "true");

    params.delete("page"); // Reset to page 1
    router.push(`/shop?${params.toString()}`);
    onClose();
  };

  const discardChanges = () => {
    // Reset to current URL params
    setLocalFilters({
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      categoryId: searchParams.get("categoryId") || "",
      subCategoryId: searchParams.get("subCategoryId") || "",
      size: searchParams.get("size") || "",
      color: searchParams.get("color") || "",
      isFeatured: searchParams.get("isFeatured") === "true",
      isNewArrival: searchParams.get("isNewArrival") === "true",
    });
    onClose();
  };

  const clearAllFilters = () => {
    setLocalFilters({
      minPrice: "",
      maxPrice: "",
      categoryId: "",
      subCategoryId: "",
      size: "",
      color: "",
      isFeatured: false,
      isNewArrival: false,
    });
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Gray", value: "gray", hex: "#808080" },
    { name: "Navy", value: "navy", hex: "#000080" },
    { name: "Beige", value: "beige", hex: "#f5f5dc" },
  ];

  const hasChanges = () => {
    return (
      localFilters.minPrice !== (searchParams.get("minPrice") || "") ||
      localFilters.maxPrice !== (searchParams.get("maxPrice") || "") ||
      localFilters.categoryId !== (searchParams.get("categoryId") || "") ||
      localFilters.subCategoryId !==
        (searchParams.get("subCategoryId") || "") ||
      localFilters.size !== (searchParams.get("size") || "") ||
      localFilters.color !== (searchParams.get("color") || "") ||
      localFilters.isFeatured !== (searchParams.get("isFeatured") === "true") ||
      localFilters.isNewArrival !==
        (searchParams.get("isNewArrival") === "true")
    );
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 35,
              stiffness: 400,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-[24px] sm:rounded-t-[28px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)] max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Handle Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center pt-3 pb-2"
            >
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex items-center justify-between px-5 sm:px-6 pb-4 sm:pb-5 border-b border-[#e5e5e5]"
            >
              <h2 className="text-lg sm:text-xl font-medium tracking-tight text-[#0a0a0a]">
                Filters
              </h2>
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="text-xs sm:text-sm font-medium text-neutral-600 hover:text-[#0a0a0a] transition-colors px-3 py-1.5 rounded-[10px] hover:bg-[#f5f5f5]"
                >
                  Clear All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#f5f5f5] transition-colors"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-600" />
                </motion.button>
              </div>
            </motion.div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 sm:py-5 space-y-5 sm:space-y-6">
              {/* Price Range */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full mb-3 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] group"
                >
                  <span>Price Range</span>
                  <motion.div
                    animate={{ rotate: openSections.price ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-[#0a0a0a] transition-colors" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openSections.price && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pb-2">
                        <div className="flex gap-3">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex-1"
                          >
                            <Input
                              type="number"
                              placeholder="Min"
                              value={localFilters.minPrice}
                              onChange={(e) =>
                                updateLocalFilter("minPrice", e.target.value)
                              }
                              className="w-full rounded-[12px] h-10 sm:h-11 text-sm border-[#e5e5e5] focus:border-[#0a0a0a] transition-all"
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex-1"
                          >
                            <Input
                              type="number"
                              placeholder="Max"
                              value={localFilters.maxPrice}
                              onChange={(e) =>
                                updateLocalFilter("maxPrice", e.target.value)
                              }
                              className="w-full rounded-[12px] h-10 sm:h-11 text-sm border-[#e5e5e5] focus:border-[#0a0a0a] transition-all"
                            />
                          </motion.div>
                        </div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-xs text-neutral-500 font-medium"
                        >
                          Enter price range in INR
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Categories */}
              {categoriesData?.data && categoriesData.data.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                >
                  <button
                    onClick={() => toggleSection("category")}
                    className="flex items-center justify-between w-full mb-3 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] group"
                  >
                    <span>Categories</span>
                    <motion.div
                      animate={{ rotate: openSections.category ? 180 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-[#0a0a0a] transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openSections.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pb-2">
                          {categoriesData.data.map((category, index) => (
                            <motion.button
                              key={category.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.03,
                                duration: 0.2,
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                updateLocalFilter(
                                  "categoryId",
                                  localFilters.categoryId === category.id
                                    ? ""
                                    : category.id
                                )
                              }
                              className={`block w-full text-left px-4 py-3 text-sm font-medium tracking-normal transition-all rounded-[12px] ${
                                localFilters.categoryId === category.id
                                  ? "bg-[#0a0a0a] text-[#fafafa] shadow-sm"
                                  : "bg-[#fafafa] hover:bg-[#f5f5f5] text-[#0a0a0a] border border-transparent hover:border-[#e5e5e5]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate pr-2">
                                  {category.name}
                                </span>
                                {category._count?.products && (
                                  <span
                                    className={`text-xs flex-shrink-0 ${
                                      localFilters.categoryId === category.id
                                        ? "text-neutral-300"
                                        : "text-neutral-500"
                                    }`}
                                  >
                                    ({category._count.products})
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Sizes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <button
                  onClick={() => toggleSection("size")}
                  className="flex items-center justify-between w-full mb-3 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] group"
                >
                  <span>Size</span>
                  <motion.div
                    animate={{ rotate: openSections.size ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-[#0a0a0a] transition-colors" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openSections.size && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 sm:gap-3 pb-2">
                        {sizes.map((size, index) => (
                          <motion.button
                            key={size}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              updateLocalFilter(
                                "size",
                                localFilters.size === size ? "" : size
                              )
                            }
                            className={`border-2 py-2.5 sm:py-3 text-sm font-medium tracking-normal transition-all rounded-[12px] ${
                              localFilters.size === size
                                ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-sm"
                                : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white text-[#0a0a0a]"
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Colors */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <button
                  onClick={() => toggleSection("color")}
                  className="flex items-center justify-between w-full mb-3 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] group"
                >
                  <span>Color</span>
                  <motion.div
                    animate={{ rotate: openSections.color ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-[#0a0a0a] transition-colors" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openSections.color && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-2">
                        {colors.map((color, index) => (
                          <motion.button
                            key={color.value}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              updateLocalFilter(
                                "color",
                                localFilters.color === color.value
                                  ? ""
                                  : color.value
                              )
                            }
                            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                              localFilters.color === color.value
                                ? "border-[#0a0a0a] ring-2 ring-[#0a0a0a] ring-offset-2 scale-110 shadow-md"
                                : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            aria-label={color.name}
                          >
                            {localFilters.color === color.value && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 15,
                                }}
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white border-2 border-[#0a0a0a] shadow-sm"
                              />
                            )}
                            {/* Tooltip */}
                            <motion.span
                              initial={{ opacity: 0, y: 5 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#0a0a0a] text-white text-[10px] font-medium rounded-[8px] pointer-events-none whitespace-nowrap z-10 shadow-lg"
                            >
                              {color.name}
                            </motion.span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <button
                  onClick={() => toggleSection("features")}
                  className="flex items-center justify-between w-full mb-3 text-sm sm:text-base font-medium tracking-normal text-[#0a0a0a] group"
                >
                  <span>Features</span>
                  <motion.div
                    animate={{ rotate: openSections.features ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-[#0a0a0a] transition-colors" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openSections.features && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pb-2">
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            updateLocalFilter(
                              "isFeatured",
                              !localFilters.isFeatured
                            )
                          }
                          className={`block w-full text-left px-4 py-3 text-sm font-medium tracking-normal transition-all rounded-[12px] ${
                            localFilters.isFeatured
                              ? "bg-[#0a0a0a] text-[#fafafa] shadow-sm"
                              : "bg-[#fafafa] hover:bg-[#f5f5f5] text-[#0a0a0a] border border-transparent hover:border-[#e5e5e5]"
                          }`}
                        >
                          Featured Products
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15, duration: 0.2 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            updateLocalFilter(
                              "isNewArrival",
                              !localFilters.isNewArrival
                            )
                          }
                          className={`block w-full text-left px-4 py-3 text-sm font-medium tracking-normal transition-all rounded-[12px] ${
                            localFilters.isNewArrival
                              ? "bg-[#0a0a0a] text-[#fafafa] shadow-sm"
                              : "bg-[#fafafa] hover:bg-[#f5f5f5] text-[#0a0a0a] border border-transparent hover:border-[#e5e5e5]"
                          }`}
                        >
                          New Arrivals
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Footer with Apply/Discard Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="border-t border-[#e5e5e5] bg-white px-5 sm:px-6 py-4 sm:py-5 space-y-3 rounded-b-[24px] sm:rounded-b-[28px]"
            >
              <div className="flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    onClick={discardChanges}
                    className="w-full h-12 rounded-[14px] border-[#e5e5e5] hover:border-[#0a0a0a] bg-white text-[#0a0a0a] text-sm font-medium transition-all"
                  >
                    Reset
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: hasChanges() ? 1.02 : 1 }}
                  whileTap={{ scale: hasChanges() ? 0.98 : 1 }}
                  className="flex-1"
                >
                  <Button
                    onClick={applyFilters}
                    disabled={!hasChanges()}
                    className="w-full h-12 rounded-[14px] bg-[#0a0a0a] text-[#fafafa] hover:bg-[#1a1a1a] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                  >
                    Apply Changes
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
