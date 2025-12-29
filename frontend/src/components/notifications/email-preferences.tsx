"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";
import { Bell, Mail, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";

interface EmailPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export function EmailPreferences() {
  const { user } = useAppSelector((state) => state.auth);
  const [preferences, setPreferences] = useState<EmailPreference[]>([
    {
      id: "order-confirmation",
      name: "Order Confirmations",
      description: "Receive emails when you place an order",
      enabled: true,
    },
    {
      id: "shipping-updates",
      name: "Shipping Updates",
      description: "Get notified when your order ships",
      enabled: true,
    },
    {
      id: "order-status",
      name: "Order Status Updates",
      description: "Updates on your order status",
      enabled: true,
    },
    {
      id: "price-drops",
      name: "Price Drop Alerts",
      description: "Notifications when products you're watching go on sale",
      enabled: false,
    },
    {
      id: "back-in-stock",
      name: "Back in Stock",
      description: "Alerts when out-of-stock items become available",
      enabled: true,
    },
    {
      id: "newsletter",
      name: "Newsletter",
      description: "Weekly updates on new products and promotions",
      enabled: false,
    },
    {
      id: "abandoned-cart",
      name: "Abandoned Cart Reminders",
      description: "Reminders about items left in your cart",
      enabled: true,
    },
  ]);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
    toast({
      title: "Preference updated",
      description: "Your email preferences have been saved",
    });
  };

  if (!user) {
    return (
      <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[16px] p-4">
        <p className="text-sm text-neutral-500 font-medium">
          Please sign in to manage email preferences
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[20px] p-5 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
          <Mail className="h-5 w-5 text-[#0a0a0a]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-medium tracking-normal text-[#0a0a0a]">
            Email Preferences
          </h2>
          <p className="text-sm text-neutral-500 font-medium">
            Choose which emails you want to receive
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {preferences.map((preference, index) => (
          <motion.div
            key={preference.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start justify-between gap-4 p-4 bg-[#fafafa] border border-[#e5e5e5] rounded-[16px] hover:border-[#0a0a0a] transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {preference.id === "order-confirmation" && (
                  <ShoppingBag className="h-4 w-4 text-neutral-500" />
                )}
                {preference.id === "price-drops" && (
                  <Tag className="h-4 w-4 text-neutral-500" />
                )}
                {preference.id === "newsletter" && (
                  <Bell className="h-4 w-4 text-neutral-500" />
                )}
                <h3 className="text-sm sm:text-base font-medium text-[#0a0a0a]">
                  {preference.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                {preference.description}
              </p>
            </div>
            <Switch
              checked={preference.enabled}
              onCheckedChange={() => togglePreference(preference.id)}
              className="flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-[#e5e5e5]">
        <Button
          variant="filled"
          className="w-full sm:w-auto rounded-[16px]"
          onClick={() => {
            toast({
              title: "Preferences saved!",
              description: "Your email preferences have been updated",
            });
          }}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
