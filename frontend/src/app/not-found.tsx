import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="container-luxury text-center space-y-6">
        <h1 className="text-6xl sm:text-8xl font-medium tracking-normal">404</h1>
        <h2 className="text-2xl sm:text-3xl font-medium tracking-normal">
          Page Not Found
        </h2>
        <p className="text-sm text-neutral-600 font-medium max-w-md mx-auto">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button size="lg" variant="filled" className="rounded-[10px]">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
