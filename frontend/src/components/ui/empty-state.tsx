import { cn } from "@/lib/utils";
import * as React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16",
        className
      )}
    >
      {icon && <div className="mb-6">{icon}</div>}
      <h2 className="text-2xl md:text-4xl font-medium tracking-normal mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-sm font-medium tracking-normal text-neutral-600 mb-8 max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
