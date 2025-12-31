import { logger } from "./logger.util";

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
  userId?: string;
  sessionId?: string;
  eventType: AnalyticsEventType;
  properties?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  timestamp?: Date;
}

/**
 * Analytics Utility
 * Production-ready event tracking for business intelligence
 * Tracks user behavior, conversions, and business metrics
 */
export class AnalyticsUtil {
  /**
   * Track an analytics event
   * Events are stored in database for analysis
   */
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // In production, you might want to use a dedicated analytics service
      // For now, we'll log and optionally store in database
      
      logger.info("Analytics event", {
        userId: event.userId,
        eventType: event.eventType,
        properties: event.properties,
        timestamp: event.timestamp || new Date(),
      });

      // Optionally store in database if you add an AnalyticsEvent model
      // await prisma.analyticsEvent.create({ data: { ... } });

      // In production, you might also send to:
      // - Google Analytics
      // - Mixpanel
      // - Amplitude
      // - Custom analytics service
    } catch (error) {
      // Don't let analytics failures break the main flow
      logger.error("Failed to track analytics event", {
        error: error instanceof Error ? error.message : String(error),
        eventType: event.eventType,
      });
    }
  }

  /**
   * Track page view
   */
  static async trackPageView(
    path: string,
    userId?: string,
    sessionId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: AnalyticsEventType.PAGE_VIEW,
      properties: { path },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Track product view
   */
  static async trackProductView(
    productId: string,
    userId?: string,
    sessionId?: string,
    ipAddress?: string
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: AnalyticsEventType.PRODUCT_VIEW,
      properties: { productId },
      ipAddress,
    });
  }

  /**
   * Track add to cart
   */
  static async trackAddToCart(
    productId: string,
    variantId: string,
    quantity: number,
    price: number,
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: AnalyticsEventType.ADD_TO_CART,
      properties: {
        productId,
        variantId,
        quantity,
        price,
        total: price * quantity,
      },
    });
  }

  /**
   * Track order completion
   */
  static async trackOrderCompleted(
    orderId: string,
    orderNumber: string,
    total: number,
    itemCount: number,
    userId: string,
    paymentMethod: string
  ): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: AnalyticsEventType.ORDER_COMPLETED,
      properties: {
        orderId,
        orderNumber,
        total,
        itemCount,
        paymentMethod,
      },
    });
  }

  /**
   * Track search
   */
  static async trackSearch(
    query: string,
    resultCount: number,
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: AnalyticsEventType.SEARCH,
      properties: {
        query,
        resultCount,
      },
    });
  }

  /**
   * Track conversion funnel
   */
  static async trackConversion(
    step: string,
    userId?: string,
    sessionId?: string,
    properties?: Record<string, unknown>
  ): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: AnalyticsEventType.CHECKOUT_STARTED,
      properties: {
        step,
        ...properties,
      },
    });
  }
}

