"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { stockAlertsService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { StockAlertCard } from "./stock-alert-card";

interface StockAlertsListProps {
  limit?: number;
}

export function StockAlertsList({ limit }: StockAlertsListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-alerts", limit],
    queryFn: () => stockAlertsService.getUserAlerts(1, limit || 20),
  });

  const deleteAlert = useMutation({
    mutationFn: (alertId: string) => stockAlertsService.deleteAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<Package className="w-4 h-4" />}
        title="Unable to load alerts"
        description="Please try again later"
      />
    );
  }

  const alerts = data?.data || [];

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-4 h-4" />}
        title="No stock alerts"
        description="You don't have any active stock alerts"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alerts.map((alert) => (
        <StockAlertCard
          key={alert.id}
          alert={alert}
          onDelete={() => deleteAlert.mutate(alert.id)}
          isDeleting={deleteAlert.isPending}
        />
      ))}
    </div>
  );
}
