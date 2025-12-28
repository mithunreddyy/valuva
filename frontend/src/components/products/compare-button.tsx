"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToComparison, removeFromComparison } from "@/store/slices/comparisonSlice";
import { Product } from "@/types";
import { GitCompare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CompareButtonProps {
  product: Product;
}

export function CompareButton({ product }: CompareButtonProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.comparison);
  const isInComparison = products.some((p) => p.id === product.id);

  const handleClick = () => {
    if (isInComparison) {
      dispatch(removeFromComparison(product.id));
      toast({
        title: "Removed from comparison",
        description: `${product.name} has been removed from comparison`,
      });
    } else {
      if (products.length >= 4) {
        toast({
          title: "Limit reached",
          description: "You can compare up to 4 products at a time",
          variant: "destructive",
        });
        return;
      }
      dispatch(addToComparison(product));
      toast({
        title: "Added to comparison",
        description: `${product.name} has been added to comparison`,
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isInComparison ? "filled" : "outline"}
      size="sm"
      className="rounded-[10px]"
    >
      <GitCompare className="w-4 h-4 mr-2" />
      {isInComparison ? "Remove from Compare" : "Add to Compare"}
    </Button>
  );
}

