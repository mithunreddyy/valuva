"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="container-luxury text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
          Something went wrong!
        </h2>
        <p className="text-sm text-neutral-600 font-medium max-w-md mx-auto">
          We encountered an error. Please try again.
        </p>
        <Button
          onClick={reset}
          size="lg"
          variant="filled"
          className="rounded-[10px]"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
