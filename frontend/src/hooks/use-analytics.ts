import { analytics } from "@/lib/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * React hook for analytics tracking
 * Automatically tracks page views and provides tracking methods
 */
export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page view on route change
  useEffect(() => {
    const fullPath = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    analytics.trackPageView(fullPath);
  }, [pathname, searchParams]);

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackRemoveFromCart: analytics.trackRemoveFromCart.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackCheckoutStarted: analytics.trackCheckoutStarted.bind(analytics),
    trackOrderCompleted: analytics.trackOrderCompleted.bind(analytics),
    trackFilterApplied: analytics.trackFilterApplied.bind(analytics),
    trackWishlistAdd: analytics.trackWishlistAdd.bind(analytics),
    trackWishlistRemove: analytics.trackWishlistRemove.bind(analytics),
    trackPaymentInitiated: analytics.trackPaymentInitiated.bind(analytics),
    trackPaymentCompleted: analytics.trackPaymentCompleted.bind(analytics),
    trackPaymentFailed: analytics.trackPaymentFailed.bind(analytics),
  };
}
