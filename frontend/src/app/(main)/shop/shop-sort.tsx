"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function ShopSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page"); // Reset to page 1 when sort changes
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Select
      value={searchParams.get("sort") || ""}
      onValueChange={handleSort}
    >
      <SelectTrigger className="w-full sm:w-48 border border-[#e5e5e5] text-sm font-medium tracking-normal h-11 hover:border-[#0a0a0a] transition-all rounded-[10px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="border border-[#e5e5e5] rounded-[10px]">
        <SelectItem value="newest" className="text-sm font-medium tracking-normal">
          Newest First
        </SelectItem>
        <SelectItem value="popular" className="text-sm font-medium tracking-normal">
          Most Popular
        </SelectItem>
        <SelectItem value="price_asc" className="text-sm font-medium tracking-normal">
          Price: Low to High
        </SelectItem>
        <SelectItem value="price_desc" className="text-sm font-medium tracking-normal">
          Price: High to Low
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
