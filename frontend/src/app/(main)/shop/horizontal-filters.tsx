"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categories";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function HorizontalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesData } = useCategories();
  const { data: filterOptions } = useFilterOptions();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const updateFilters = (key: string, value: string, closeMobile = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 when filters change
    router.push(`/shop?${params.toString()}`);
    if (closeMobile) {
      setIsMobileFilterOpen(false);
    }
  };

  const clearFilter = (key: string, closeMobile = false) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key === "minPrice" || key === "maxPrice") {
      setMinPrice("");
      setMaxPrice("");
    }
    router.push(`/shop?${params.toString()}`);
    if (closeMobile) {
      setIsMobileFilterOpen(false);
    }
  };

  const clearAllFilters = () => {
    router.push("/shop");
    setMinPrice("");
    setMaxPrice("");
  };

  // Production-ready: Use real filter options from API, fallback to common sizes/colors
  const sizes = (filterOptions as { sizes: string[] })?.sizes || [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ];
  const colors = (
    filterOptions as {
      colors: Array<{ name: string; value: string; hex?: string }>;
    }
  )?.colors || [
    { name: "Black", value: "black", hex: "#0a0a0a" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Gray", value: "gray", hex: "#808080" },
    { name: "Navy", value: "navy", hex: "#000080" },
    { name: "Beige", value: "beige", hex: "#f5f5dc" },
  ];

  const selectedCategory = categoriesData?.data?.find(
    (c) => c.id === searchParams.get("categoryId")
  );
  const selectedSize = searchParams.get("size");
  const selectedColor = searchParams.get("color");
  const isFeatured = searchParams.get("isFeatured") === "true";
  const isNewArrival = searchParams.get("isNewArrival") === "true";
  const hasPriceFilter =
    searchParams.get("minPrice") || searchParams.get("maxPrice");

  const activeFiltersCount = [
    searchParams.get("categoryId"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("size"),
    searchParams.get("color"),
    searchParams.get("isFeatured"),
    searchParams.get("isNewArrival"),
  ].filter(Boolean).length;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  return (
    <div className="w-full">
      {/* Mobile Filter Button - Only visible on mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 border transition-all duration-200 text-sm font-medium tracking-normal rounded-[16px] shadow-sm ${
            activeFiltersCount > 0
              ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
              : "border-[#e5e5e5] bg-white text-[#0a0a0a] hover:border-[#0a0a0a]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 text-[10px] font-medium rounded-[8px]">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Active Filter Chips - Mobile Only */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {selectedCategory && (
              <button
                onClick={() => clearFilter("categoryId")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[12px]"
              >
                {selectedCategory.name}
                <X className="h-3 w-3" />
              </button>
            )}
            {selectedSize && (
              <button
                onClick={() => clearFilter("size")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[12px]"
              >
                Size: {selectedSize}
                <X className="h-3 w-3" />
              </button>
            )}
            {selectedColor && (
              <button
                onClick={() => clearFilter("color")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[12px]"
              >
                {colors.find((c) => c.value === selectedColor)?.name}
                <X className="h-3 w-3" />
              </button>
            )}
            {hasPriceFilter && (
              <button
                onClick={() => {
                  clearFilter("minPrice");
                  clearFilter("maxPrice");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[12px]"
              >
                Price
                <X className="h-3 w-3" />
              </button>
            )}
            {isFeatured && (
              <button
                onClick={() => updateFilters("isFeatured", "")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[12px]"
              >
                Featured
                <X className="h-3 w-3" />
              </button>
            )}
            {isNewArrival && (
              <button
                onClick={() => updateFilters("isNewArrival", "")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[12px]"
              >
                New
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[24px] shadow-2xl md:hidden max-h-[85vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-[#e5e5e5] rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#e5e5e5]">
              <h3 className="text-lg font-medium tracking-normal text-[#0a0a0a]">
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-[12px] hover:bg-[#fafafa] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => clearFilter("categoryId", true)}
                    className={`w-full text-left px-4 py-3 rounded-[16px] text-sm font-medium transition-all ${
                      !selectedCategory
                        ? "bg-[#0a0a0a] text-[#fafafa]"
                        : "bg-[#fafafa] text-[#0a0a0a] hover:bg-[#e5e5e5]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categoriesData?.data?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        updateFilters("categoryId", category.id, true)
                      }
                      className={`w-full text-left px-4 py-3 rounded-[16px] text-sm font-medium transition-all flex items-center justify-between ${
                        selectedCategory?.id === category.id
                          ? "bg-[#0a0a0a] text-[#fafafa]"
                          : "bg-[#fafafa] text-[#0a0a0a] hover:bg-[#e5e5e5]"
                      }`}
                    >
                      <span>{category.name}</span>
                      {category._count?.products && (
                        <span
                          className={`text-xs ${
                            selectedCategory?.id === category.id
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          ({category._count.products})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] mb-3">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateFilters("size", size, true)}
                      className={`py-3 rounded-[16px] text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-[#0a0a0a] text-[#fafafa] shadow-md"
                          : "bg-[#fafafa] text-[#0a0a0a] border border-[#e5e5e5] hover:border-[#0a0a0a]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] mb-3">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateFilters("color", color.value, true)}
                      className={`aspect-square rounded-[16px] border-2 transition-all ${
                        selectedColor === color.value
                          ? "border-[#0a0a0a] ring-2 ring-[#0a0a0a] ring-offset-2 scale-110"
                          : "border-[#e5e5e5] hover:border-[#0a0a0a] hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] mb-3">
                  Price Range (INR)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onBlur={() => updateFilters("minPrice", minPrice, true)}
                      className="flex-1 rounded-[16px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm py-3"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onBlur={() => updateFilters("maxPrice", maxPrice, true)}
                      className="flex-1 rounded-[16px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm py-3"
                    />
                  </div>
                </div>
              </div>

              {/* Featured & New Arrivals */}
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] mb-3">
                  Special
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() =>
                      updateFilters(
                        "isFeatured",
                        isFeatured ? "" : "true",
                        true
                      )
                    }
                    className={`py-3 rounded-[16px] text-sm font-medium transition-all ${
                      isFeatured
                        ? "bg-[#0a0a0a] text-[#fafafa] shadow-md"
                        : "bg-[#fafafa] text-[#0a0a0a] border border-[#e5e5e5] hover:border-[#0a0a0a]"
                    }`}
                  >
                    Featured
                  </button>
                  <button
                    onClick={() =>
                      updateFilters(
                        "isNewArrival",
                        isNewArrival ? "" : "true",
                        true
                      )
                    }
                    className={`py-3 rounded-[16px] text-sm font-medium transition-all ${
                      isNewArrival
                        ? "bg-[#0a0a0a] text-[#fafafa] shadow-md"
                        : "bg-[#fafafa] text-[#0a0a0a] border border-[#e5e5e5] hover:border-[#0a0a0a]"
                    }`}
                  >
                    New Arrivals
                  </button>
                </div>
              </div>

              {/* Clear All */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-3.5 rounded-[16px] border-2 border-red-500 text-red-600 bg-red-50 text-sm font-medium transition-all hover:bg-red-100"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Desktop Horizontal Filter Row */}
      <div className="hidden md:flex flex-wrap items-center gap-2.5 pb-5 sm:pb-6 border-b border-[#e5e5e5]">
        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] whitespace-nowrap shadow-sm hover:shadow-md ${
                selectedCategory
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-md"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              <span className="hidden sm:inline">
                {selectedCategory ? selectedCategory.name : "Category"}
              </span>
              <span className="sm:hidden">
                {selectedCategory ? selectedCategory.name.slice(0, 8) : "Cat"}
              </span>
              <ChevronDown
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                  selectedCategory
                    ? "text-[#fafafa]"
                    : "text-neutral-500 group-hover:text-[#0a0a0a]"
                }`}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 sm:w-64 rounded-[16px] border border-[#e5e5e5] shadow-lg bg-white p-2"
          >
            <DropdownMenuLabel className="text-xs font-medium tracking-normal text-[#0a0a0a] px-2 py-1.5">
              Select Category
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#e5e5e5] my-1" />
            <DropdownMenuItem
              onClick={() => clearFilter("categoryId")}
              className={`text-sm font-medium tracking-normal rounded-[12px] px-3 py-2.5 cursor-pointer ${
                !selectedCategory
                  ? "bg-[#fafafa] text-[#0a0a0a]"
                  : "hover:bg-[#fafafa]"
              }`}
            >
              All Categories
            </DropdownMenuItem>
            {categoriesData?.data?.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => updateFilters("categoryId", category.id)}
                className={`text-sm font-medium tracking-normal rounded-[12px] px-3 py-2.5 cursor-pointer transition-colors ${
                  selectedCategory?.id === category.id
                    ? "bg-[#0a0a0a] text-[#fafafa]"
                    : "hover:bg-[#fafafa]"
                }`}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  {category._count?.products && (
                    <span
                      className={`text-xs ml-2 ${
                        selectedCategory?.id === category.id
                          ? "text-neutral-300"
                          : "text-neutral-500"
                      }`}
                    >
                      ({category._count.products})
                    </span>
                  )}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Size Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] whitespace-nowrap shadow-sm hover:shadow-md ${
                selectedSize
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-md"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              {selectedSize ? (
                <>
                  <span className="hidden sm:inline">Size: </span>
                  {selectedSize}
                </>
              ) : (
                "Size"
              )}
              <ChevronDown
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                  selectedSize
                    ? "text-[#fafafa]"
                    : "text-neutral-500 group-hover:text-[#0a0a0a]"
                }`}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 sm:w-56 rounded-[16px] border border-[#e5e5e5] shadow-lg bg-white p-2"
          >
            <DropdownMenuLabel className="text-xs font-medium tracking-normal text-[#0a0a0a] px-2 py-1.5">
              Select Size
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#e5e5e5] my-1" />
            <DropdownMenuItem
              onClick={() => clearFilter("size")}
              className={`text-sm font-medium tracking-normal rounded-[12px] px-3 py-2.5 cursor-pointer ${
                !selectedSize
                  ? "bg-[#fafafa] text-[#0a0a0a]"
                  : "hover:bg-[#fafafa]"
              }`}
            >
              All Sizes
            </DropdownMenuItem>
            <div className="grid grid-cols-3 gap-1.5 px-2 py-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => updateFilters("size", size)}
                  className={`text-sm font-medium tracking-normal rounded-[12px] px-3 py-2 transition-all duration-200 ${
                    selectedSize === size
                      ? "bg-[#0a0a0a] text-[#fafafa] shadow-sm"
                      : "hover:bg-[#fafafa] text-[#0a0a0a]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Color Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] whitespace-nowrap shadow-sm hover:shadow-md ${
                selectedColor
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-md"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              {selectedColor ? (
                <>
                  <div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-[#e5e5e5]"
                    style={{
                      backgroundColor: colors.find(
                        (c) => c.value === selectedColor
                      )?.hex,
                    }}
                  />
                  <span className="hidden sm:inline">
                    {colors.find((c) => c.value === selectedColor)?.name}
                  </span>
                  <span className="sm:hidden">Color</span>
                </>
              ) : (
                "Color"
              )}
              <ChevronDown
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                  selectedColor
                    ? "text-[#fafafa]"
                    : "text-neutral-500 group-hover:text-[#0a0a0a]"
                }`}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 sm:w-64 rounded-[16px] border border-[#e5e5e5] shadow-lg bg-white p-2"
          >
            <DropdownMenuLabel className="text-xs font-medium tracking-normal text-[#0a0a0a] px-2 py-1.5">
              Select Color
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#e5e5e5] my-1" />
            <DropdownMenuItem
              onClick={() => clearFilter("color")}
              className={`text-sm font-medium tracking-normal rounded-[12px] px-3 py-2.5 cursor-pointer ${
                !selectedColor
                  ? "bg-[#fafafa] text-[#0a0a0a]"
                  : "hover:bg-[#fafafa]"
              }`}
            >
              All Colors
            </DropdownMenuItem>
            <div className="p-2 grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateFilters("color", color.value)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedColor === color.value
                      ? "border-[#0a0a0a] ring-2 ring-[#0a0a0a] ring-offset-1 scale-110"
                      : "border-[#e5e5e5] hover:border-[#0a0a0a] hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] whitespace-nowrap shadow-sm hover:shadow-md ${
                hasPriceFilter
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-md"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              Price
              {hasPriceFilter && (
                <span className="hidden sm:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded-[6px] ml-1">
                  {minPrice && maxPrice
                    ? `${minPrice}-${maxPrice}`
                    : minPrice
                    ? `>${minPrice}`
                    : `<${maxPrice}`}
                </span>
              )}
              <ChevronDown
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                  hasPriceFilter
                    ? "text-[#fafafa]"
                    : "text-neutral-500 group-hover:text-[#0a0a0a]"
                }`}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-72 sm:w-80 p-4 rounded-[16px] border border-[#e5e5e5] shadow-lg bg-white"
          >
            <DropdownMenuLabel className="text-xs font-medium tracking-normal text-[#0a0a0a] mb-3">
              Price Range (INR)
            </DropdownMenuLabel>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => updateFilters("minPrice", minPrice)}
                  className="flex-1 rounded-[12px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => updateFilters("maxPrice", maxPrice)}
                  className="flex-1 rounded-[12px] border border-[#e5e5e5] focus:border-[#0a0a0a] text-sm"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    clearFilter("minPrice");
                    clearFilter("maxPrice");
                  }}
                  className="text-xs text-neutral-500 hover:text-[#0a0a0a] font-medium tracking-normal transition-colors px-2 py-1 rounded-[8px] hover:bg-[#fafafa]"
                >
                  Clear
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Featured Filter */}
        <button
          onClick={() => updateFilters("isFeatured", isFeatured ? "" : "true")}
          className={`px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] whitespace-nowrap shadow-sm hover:shadow-md ${
            isFeatured
              ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-md"
              : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
          }`}
        >
          Featured
        </button>

        {/* New Arrivals Filter */}
        <button
          onClick={() =>
            updateFilters("isNewArrival", isNewArrival ? "" : "true")
          }
          className={`px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] whitespace-nowrap shadow-sm hover:shadow-md ${
            isNewArrival
              ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] shadow-md"
              : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
          }`}
        >
          <span className="hidden sm:inline">New Arrivals</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-[#e5e5e5] hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 text-xs sm:text-sm font-medium tracking-normal rounded-[16px] bg-white whitespace-nowrap shadow-sm hover:shadow-md"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">
              Clear All ({activeFiltersCount})
            </span>
            <span className="sm:hidden">Clear ({activeFiltersCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
