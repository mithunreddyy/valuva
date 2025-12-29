/**
 * Analytics Tracking Utility
 * Production-ready event tracking for frontend
 * Integrates with backend analytics system
 */

export enum AnalyticsEventType {
  PAGE_VIEW = "PAGE_VIEW",
  PRODUCT_VIEW = "PRODUCT_VIEW",
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  CHECKOUT_STARTED = "CHECKOUT_STARTED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  SEARCH = "SEARCH",
  FILTER_APPLIED = "FILTER_APPLIED",
  COUPON_APPLIED = "COUPON_APPLIED",
  WISHLIST_ADD = "WISHLIST_ADD",
  WISHLIST_REMOVE = "WISHLIST_REMOVE",
  REVIEW_SUBMITTED = "REVIEW_SUBMITTED",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
}

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

class Analytics {
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId();
    // Get user ID from storage (will be set via setUserId when user logs in)
    // We don't store user ID in localStorage for security reasons
  }

  private getOrCreateSessionId(): string {
    if (typeof window === "undefined") {
      return "";
    }

    const stored = sessionStorage.getItem("analytics_session_id");
    if (stored) {
      return stored;
    }

    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    sessionStorage.setItem("analytics_session_id", newSessionId);
    return newSessionId;
  }

  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  private async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Production-ready: Fail if API URL is not configured
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl && process.env.NODE_ENV === "production") {
        throw new Error(
          "NEXT_PUBLIC_API_URL environment variable is required in production"
        );
      }
      const apiUrlFinal = apiUrl || "http://localhost:5000";

      // Send to backend analytics endpoint
      const response = await fetch(`${apiUrlFinal}/api/v1/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof window !== "undefined" ? document.referrer : "",
          userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
        }),
      });

      if (!response.ok) {
        console.warn("Analytics tracking failed", response.status);
      }
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      console.warn("Analytics error:", error);
    }
  }

  // Public tracking methods
  trackPageView(path: string, properties?: Record<string, unknown>): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PAGE_VIEW,
      properties: { path, ...properties },
    });
  }

  trackProductView(
    productId: string,
    properties?: Record<string, unknown>
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PRODUCT_VIEW,
      properties: { productId, ...properties },
    });
  }

  trackAddToCart(
    productId: string,
    variantId: string,
    quantity: number,
    price: number,
    properties?: Record<string, unknown>
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.ADD_TO_CART,
      properties: {
        productId,
        variantId,
        quantity,
        price,
        total: price * quantity,
        ...properties,
      },
    });
  }

  trackRemoveFromCart(
    productId: string,
    variantId: string,
    quantity: number,
    properties?: Record<string, unknown>
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.REMOVE_FROM_CART,
      properties: { productId, variantId, quantity, ...properties },
    });
  }

  trackSearch(
    query: string,
    resultCount: number,
    properties?: Record<string, unknown>
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.SEARCH,
      properties: { query, resultCount, ...properties },
    });
  }

  trackCheckoutStarted(properties?: Record<string, unknown>): void {
    this.trackEvent({
      eventType: AnalyticsEventType.CHECKOUT_STARTED,
      properties,
    });
  }

  trackOrderCompleted(
    orderId: string,
    orderNumber: string,
    total: number,
    itemCount: number,
    paymentMethod: string,
    properties?: Record<string, unknown>
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.ORDER_COMPLETED,
      properties: {
        orderId,
        orderNumber,
        total,
        itemCount,
        paymentMethod,
        ...properties,
      },
    });
  }

  trackFilterApplied(filters: Record<string, unknown>): void {
    this.trackEvent({
      eventType: AnalyticsEventType.FILTER_APPLIED,
      properties: { filters },
    });
  }

  trackWishlistAdd(productId: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.WISHLIST_ADD,
      properties: { productId },
    });
  }

  trackWishlistRemove(productId: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.WISHLIST_REMOVE,
      properties: { productId },
    });
  }

  trackPaymentInitiated(orderId: string, amount: number, method: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PAYMENT_INITIATED,
      properties: { orderId, amount, method },
    });
  }

  trackPaymentCompleted(orderId: string, transactionId: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PAYMENT_COMPLETED,
      properties: { orderId, transactionId },
    });
  }

  trackPaymentFailed(orderId: string, reason?: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PAYMENT_FAILED,
      properties: { orderId, reason },
    });
  }

  trackApiError(url: string, status: number, method?: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PAGE_VIEW, // Use PAGE_VIEW as fallback since API_ERROR doesn't exist
      properties: {
        errorType: "API_ERROR",
        url,
        status,
        method,
      },
    });
  }
}

// Singleton instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return analytics;
}
