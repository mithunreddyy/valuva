import { useCallback, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function useOAuth() {
  const [isLoading, setIsLoading] = useState<"google" | "apple" | null>(null);

  const signInWithGoogle = useCallback(() => {
    try {
      setIsLoading("google");
      // Production-ready: Fail if API URL is not configured
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl && process.env.NODE_ENV === "production") {
        throw new Error(
          "NEXT_PUBLIC_API_URL environment variable is required in production"
        );
      }
      const apiUrlFinal = apiUrl || "http://localhost:5000";
      
      // Store current path for redirect
      if (typeof window !== "undefined") {
        sessionStorage.setItem("oauth_redirect", window.location.pathname);
      }
      
      window.location.href = `${apiUrlFinal}/api/v1/auth/oauth/google`;
    } catch (error) {
      setIsLoading(null);
      const errorMessage = error instanceof Error ? error.message : "Failed to initiate Google sign in";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, []);

  const signInWithApple = useCallback(() => {
    setIsLoading("apple");
    toast({
      title: "Apple Sign In",
      description: "Apple Sign In is coming soon!",
    });
    setTimeout(() => {
      setIsLoading(null);
    }, 1000);
  }, []);

  return {
    signInWithGoogle,
    signInWithApple,
    isLoading,
  };
}

