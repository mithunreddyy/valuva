import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[20px] overflow-hidden">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="p-5 space-y-2.5">
        <Skeleton className="h-4 w-3/4 rounded-[8px]" />
        <Skeleton className="h-4 w-1/2 rounded-[8px]" />
      </div>
    </div>
  );
}
