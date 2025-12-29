"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { newsletterService } from "@/services";
import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      await newsletterService.subscribe({ email });
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage || "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm font-medium text-neutral-600">
          Thank you for subscribing!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-[10px] flex-1"
        required
      />
      <Button
        type="submit"
        variant="filled"
        className="rounded-[10px]"
        disabled={isLoading}
      >
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}

