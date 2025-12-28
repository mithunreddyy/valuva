"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stockAlertsApi } from "@/services/api/stock-alerts";
import { Bell, BellOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StockAlertButtonProps {
  productId: string;
  hasStock: boolean;
}

export function StockAlertButton({
  productId,
  hasStock,
}: StockAlertButtonProps) {
  const queryClient = useQueryClient();

  const { data: alerts } = useQuery({
    queryKey: ["stock-alerts"],
    queryFn: () => stockAlertsApi.getUserAlerts(),
  });

  const hasAlert = alerts?.some((alert) => alert.productId === productId);

  const createAlert = useMutation({
    mutationFn: () => stockAlertsApi.createAlert(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      toast({
        title: "Alert Created",
        description: "We'll notify you when this product is back in stock",
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: () => stockAlertsApi.deleteAlert(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      toast({
        title: "Alert Removed",
        description: "Stock alert has been removed",
      });
    },
  });

  if (hasStock) {
    return null;
  }

  return (
    <Button
      onClick={() => (hasAlert ? deleteAlert.mutate() : createAlert.mutate())}
      variant="outline"
      className="rounded-[10px]"
      disabled={createAlert.isPending || deleteAlert.isPending}
    >
      {hasAlert ? (
        <>
          <BellOff className="w-4 h-4 mr-2" />
          Remove Alert
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 mr-2" />
          Notify Me When In Stock
        </>
      )}
    </Button>
  );
}

