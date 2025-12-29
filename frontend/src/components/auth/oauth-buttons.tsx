"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { OAuthErrorBoundary } from "./oauth-error-boundary";

interface OAuthButtonsProps {
  mode?: "login" | "register";
  className?: string;
}

export function OAuthButtons({ mode = "login", className = "" }: OAuthButtonsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = useCallback(() => {
    try {
      setIsLoading("google");
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const redirectUrl = `${apiUrl}/api/v1/auth/oauth/google`;
      
      // Store the current page for redirect after OAuth
      if (typeof window !== "undefined") {
        sessionStorage.setItem("oauth_redirect", window.location.pathname);
      }
      
      window.location.href = redirectUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initiate Google sign in";
      setError(errorMessage);
      setIsLoading(null);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, []);

  const handleAppleSignIn = useCallback(() => {
    setIsLoading("apple");
    setError(null);
    toast({
      title: "Apple Sign In",
      description: "Apple Sign In is coming soon!",
    });
    // Reset loading after a short delay
    setTimeout(() => {
      setIsLoading(null);
    }, 1000);
  }, []);

  return (
    <OAuthErrorBoundary>
      <div className={`space-y-3 ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-neutral-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-[10px] border-neutral-200 hover:bg-neutral-50 transition-colors"
          onClick={handleGoogleSignIn}
          disabled={isLoading !== null}
        >
          {isLoading === "google" ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </div>
          )}
        </Button>

        {/* Apple Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-[10px] border-neutral-200 hover:bg-neutral-50 transition-colors"
          onClick={handleAppleSignIn}
          disabled={isLoading !== null}
        >
          {isLoading === "apple" ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </div>
          )}
        </Button>
        </div>
      </div>
    </OAuthErrorBoundary>
  );
}

