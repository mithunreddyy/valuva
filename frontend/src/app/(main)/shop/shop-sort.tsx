"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
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

  const currentSort = searchParams.get("sort") || "";

  return (
    <div className="relative w-full sm:w-auto">
      <Select value={currentSort} onValueChange={handleSort}>
        <SelectTrigger className="w-full sm:w-[180px] border border-[#e5e5e5] text-sm font-medium tracking-normal h-11 sm:h-11 hover:border-[#0a0a0a] transition-all rounded-[16px] bg-white shadow-sm hover:shadow-md">
          <div className="flex items-center gap-2.5 w-full">
            <ArrowUpDown className="h-4 w-4 text-neutral-500 flex-shrink-0" />
            <SelectValue
              placeholder="Sort by"
              className="text-[#0a0a0a] flex-1 text-left"
            />
          </div>
        </SelectTrigger>
        <SelectContent className="border border-[#e5e5e5] rounded-[16px] shadow-lg bg-white">
          <SelectItem
            value="newest"
            className="text-sm font-medium tracking-normal rounded-[12px] focus:bg-[#fafafa] cursor-pointer py-2.5"
          >
            Newest First
          </SelectItem>
          <SelectItem
            value="popular"
            className="text-sm font-medium tracking-normal rounded-[12px] focus:bg-[#fafafa] cursor-pointer py-2.5"
          >
            Most Popular
          </SelectItem>
          <SelectItem
            value="price_asc"
            className="text-sm font-medium tracking-normal rounded-[12px] focus:bg-[#fafafa] cursor-pointer py-2.5"
          >
            Price: Low to High
          </SelectItem>
          <SelectItem
            value="price_desc"
            className="text-sm font-medium tracking-normal rounded-[12px] focus:bg-[#fafafa] cursor-pointer py-2.5"
          >
            Price: High to Low
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
