"use client";

import { Button } from "@/components/ui/button";
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
import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function HorizontalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesData } = useCategories();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 when filters change
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key === "minPrice" || key === "maxPrice") {
      setMinPrice("");
      setMaxPrice("");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/shop");
    setMinPrice("");
    setMaxPrice("");
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
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
  const hasPriceFilter = searchParams.get("minPrice") || searchParams.get("maxPrice");

  const activeFiltersCount = [
    searchParams.get("categoryId"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("size"),
    searchParams.get("color"),
    searchParams.get("isFeatured"),
    searchParams.get("isNewArrival"),
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Horizontal Filter Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-6 border-b border-[#e5e5e5]">
        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] whitespace-nowrap ${
                selectedCategory
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              <span className="hidden sm:inline">
                {selectedCategory ? selectedCategory.name : "Category"}
              </span>
              <span className="sm:hidden">Cat</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-[10px]">
            <DropdownMenuLabel className="text-xs font-medium tracking-normal">
              Select Category
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => clearFilter("categoryId")}
              className={`text-sm font-medium tracking-normal ${
                !selectedCategory ? "bg-[#fafafa]" : ""
              }`}
            >
              All Categories
            </DropdownMenuItem>
            {categoriesData?.data?.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => updateFilters("categoryId", category.id)}
                className={`text-sm font-medium tracking-normal ${
                  selectedCategory?.id === category.id ? "bg-[#fafafa]" : ""
                }`}
              >
                {category.name}
                {category._count?.products && (
                  <span className="ml-auto text-xs text-neutral-500">
                    ({category._count.products})
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Size Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] whitespace-nowrap ${
                selectedSize
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
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
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-[10px]">
            <DropdownMenuLabel className="text-xs font-medium tracking-normal">
              Select Size
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => clearFilter("size")}
              className={`text-sm font-medium tracking-normal ${
                !selectedSize ? "bg-[#fafafa]" : ""
              }`}
            >
              All Sizes
            </DropdownMenuItem>
            {sizes.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => updateFilters("size", size)}
                className={`text-sm font-medium tracking-normal ${
                  selectedSize === size ? "bg-[#fafafa]" : ""
                }`}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Color Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] whitespace-nowrap ${
                selectedColor
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              {selectedColor ? (
                <>
                  <span className="hidden sm:inline">Color: </span>
                  {colors.find((c) => c.value === selectedColor)?.name}
                </>
              ) : (
                "Color"
              )}
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-[10px]">
            <DropdownMenuLabel className="text-xs font-medium tracking-normal">
              Select Color
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => clearFilter("color")}
              className={`text-sm font-medium tracking-normal ${
                !selectedColor ? "bg-[#fafafa]" : ""
              }`}
            >
              All Colors
            </DropdownMenuItem>
            <div className="p-2 grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateFilters("color", color.value)}
                  className={`w-8 h-8 rounded-[6px] border-2 transition-all ${
                    selectedColor === color.value
                      ? "border-[#0a0a0a] ring-2 ring-[#0a0a0a] ring-offset-1"
                      : "border-[#e5e5e5] hover:border-[#0a0a0a]"
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] whitespace-nowrap ${
                hasPriceFilter
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                  : "border-[#e5e5e5] hover:border-[#0a0a0a] bg-white"
              }`}
            >
              Price
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-4 rounded-[10px]">
            <DropdownMenuLabel className="text-xs font-medium tracking-normal mb-3">
              Price Range (INR)
            </DropdownMenuLabel>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => updateFilters("minPrice", minPrice)}
                  className="input-luxury rounded-[8px]"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => updateFilters("maxPrice", maxPrice)}
                  className="input-luxury rounded-[8px]"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    clearFilter("minPrice");
                    clearFilter("maxPrice");
                  }}
                  className="text-xs text-neutral-500 hover:text-[#0a0a0a] font-medium tracking-normal"
                >
                  Clear
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Featured Filter */}
        <button
          onClick={() =>
            updateFilters("isFeatured", isFeatured ? "" : "true")
          }
          className={`px-3 sm:px-4 py-2 sm:py-2.5 border transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] whitespace-nowrap ${
            isFeatured
              ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
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
          className={`px-3 sm:px-4 py-2 sm:py-2.5 border transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] whitespace-nowrap ${
            isNewArrival
              ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
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
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-[#e5e5e5] hover:border-red-500 hover:text-red-500 transition-all text-xs sm:text-sm font-medium tracking-normal rounded-[10px] bg-white whitespace-nowrap"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Clear All ({activeFiltersCount})</span>
            <span className="sm:hidden">Clear ({activeFiltersCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}

