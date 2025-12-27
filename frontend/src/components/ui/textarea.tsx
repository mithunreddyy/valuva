"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Textarea component
 * Styled textarea input for multi-line text
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full border border-[#e5e5e5] bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-50 rounded-[10px] transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

