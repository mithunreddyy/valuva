import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-normal border transition-all duration-300 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-[10px]",
  {
    variants: {
      variant: {
        default:
          "border-[#0a0a0a] bg-transparent text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#fafafa]",
        outline:
          "border-[#e5e5e5] bg-transparent text-[#0a0a0a] hover:border-[#0a0a0a]",
        filled:
          "border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] hover:bg-[#1a1a1a] hover:text-[#fafafa]",
        ghost:
          "border-transparent bg-transparent text-[#0a0a0a] hover:border-[#e5e5e5]",
        link: "border-0 text-[#0a0a0a] underline-offset-4 hover:underline tracking-normal rounded-none",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 text-xs rounded-[8px]",
        lg: "h-14 px-10 text-base rounded-[12px]",
        icon: "h-11 w-11 p-0 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
