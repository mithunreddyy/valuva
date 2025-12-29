"use client";

import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Bell, BellOff } from "lucide-react";

export function PushSettings() {
  const { isSupported, isSubscribed, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[16px] p-4">
        <p className="text-sm text-neutral-500 font-medium">
          Push notifications are not supported in your browser
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[20px] p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] mb-1">
            Push Notifications
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Get notified about order updates, promotions, and more
          </p>
        </div>
        {isSubscribed ? (
          <Button
            variant="outline"
            onClick={unsubscribe}
            className="rounded-[16px] gap-2"
          >
            <BellOff className="h-4 w-4" />
            Disable
          </Button>
        ) : (
          <Button
            variant="filled"
            onClick={subscribe}
            className="rounded-[16px] gap-2"
          >
            <Bell className="h-4 w-4" />
            Enable
          </Button>
        )}
      </div>
    </div>
  );
}

