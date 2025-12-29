"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Facebook,
  Link as LinkIcon,
  Mail,
  Share2,
  Twitter,
} from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description,
  className = "",
}: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || "");

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      setIsOpen(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard",
      });
      setIsOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        setIsOpen(false);
      } catch {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      action: () => shareToSocial("facebook"),
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => shareToSocial("twitter"),
      color: "text-blue-400",
    },
    {
      name: "WhatsApp",
      icon: Share2,
      action: () => shareToSocial("whatsapp"),
      color: "text-green-600",
    },
    {
      name: "Email",
      icon: Mail,
      action: () => shareToSocial("email"),
      color: "text-neutral-600",
    },
    {
      name: "Copy Link",
      icon: LinkIcon,
      action: copyToClipboard,
      color: "text-neutral-600",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-[16px] gap-2"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 bg-white border border-[#e5e5e5] rounded-[20px] p-2 shadow-lg z-50 min-w-[200px]"
            >
              {typeof navigator !== "undefined" &&
                typeof navigator.share === "function" && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-[#0a0a0a] hover:bg-[#fafafa] rounded-[12px] transition-colors flex items-center gap-2 mb-1"
                  >
                    <Share2 className="h-4 w-4" />
                    Share via...
                  </button>
                )}
              {shareOptions.map((option, index) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-[#0a0a0a] hover:bg-[#fafafa] rounded-[12px] transition-colors flex items-center gap-2"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <option.icon className={`h-4 w-4 ${option.color}`} />
                  {option.name}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
