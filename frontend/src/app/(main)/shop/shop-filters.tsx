"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categories";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categoriesData } = useCategories();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    size: true,
    color: false,
  });

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/shop");
    setMinPrice("");
    setMaxPrice("");
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Gray", value: "gray", hex: "#808080" },
    { name: "Navy", value: "navy", hex: "#000080" },
    { name: "Beige", value: "beige", hex: "#f5f5dc" },
  ];

  return (
    <div className="bg-white border border-[#e5e5e5] p-6 space-y-6 rounded-[12px]">
      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
        <h3 className="text-sm font-medium tracking-normal">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-xs font-medium tracking-normal rounded-[8px]"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full mb-4 text-sm font-medium tracking-normal"
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.price && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={() => updateFilters("minPrice", minPrice)}
                className="rounded-[10px]"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={() => updateFilters("maxPrice", maxPrice)}
                className="rounded-[10px]"
              />
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Enter price range in INR
            </p>
          </div>
        )}
      </div>

      {/* Categories */}
      {categoriesData?.data && categoriesData.data.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full mb-4 text-sm font-medium tracking-normal"
          >
            <span>Categories</span>
            {openSections.category ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {openSections.category && (
            <div className="space-y-2">
              {categoriesData.data.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    updateFilters(
                      "categoryId",
                      searchParams.get("categoryId") === category.id
                        ? ""
                        : category.id
                    )
                  }
                  className={`block w-full text-left px-4 py-2.5 text-xs font-medium tracking-normal transition-all rounded-[8px] ${
                    searchParams.get("categoryId") === category.id
                      ? "bg-[#0a0a0a] text-[#fafafa]"
                      : "hover:bg-[#fafafa]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    {category._count?.products && (
                      <span className={`text-[10px] ${
                        searchParams.get("categoryId") === category.id
                          ? "text-neutral-300"
                          : "text-neutral-500"
                      }`}>
                        ({category._count.products})
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sizes */}
      <div>
        <button
          onClick={() => toggleSection("size")}
          className="flex items-center justify-between w-full mb-4 text-sm font-medium tracking-normal"
        >
          <span>Size</span>
          {openSections.size ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.size && (
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() =>
                  updateFilters(
                    "size",
                    searchParams.get("size") === size ? "" : size
                  )
                }
                className={`border border-[#e5e5e5] py-2.5 text-xs font-medium tracking-normal transition-all rounded-[8px] ${
                  searchParams.get("size") === size
                    ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]"
                    : "hover:border-[#0a0a0a] bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div>
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full mb-4 text-sm font-medium tracking-normal"
        >
          <span>Color</span>
          {openSections.color ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.color && (
          <div className="grid grid-cols-5 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  updateFilters(
                    "color",
                    searchParams.get("color") === color.value ? "" : color.value
                  )
                }
                className={`relative w-full aspect-square border-2 transition-all rounded-[8px] ${
                  searchParams.get("color") === color.value
                    ? "border-[#0a0a0a] ring-2 ring-[#0a0a0a] ring-offset-2"
                    : "border-[#e5e5e5] hover:border-[#0a0a0a]"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
