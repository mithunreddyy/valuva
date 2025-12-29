import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function useOAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<"google" | "apple" | null>(null);

  const signInWithGoogle = useCallback(() => {
    try {
      setIsLoading("google");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // Store current path for redirect
      if (typeof window !== "undefined") {
        sessionStorage.setItem("oauth_redirect", window.location.pathname);
      }
      
      window.location.href = `${apiUrl}/api/v1/auth/oauth/google`;
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

