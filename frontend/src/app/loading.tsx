import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
