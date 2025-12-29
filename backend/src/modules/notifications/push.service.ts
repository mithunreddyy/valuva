import webpush from "web-push";
import { prisma } from "../../config/database";
import { logger } from "../../utils/logger.util";

/**
 * Push Notification Service
 * Handles browser push notifications
 */
export class PushNotificationService {
  private static vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || "",
    privateKey: process.env.VAPID_PRIVATE_KEY || "",
  };

  /**
   * Initialize VAPID keys for web push
   */
  static initialize() {
    if (!this.vapidKeys.publicKey || !this.vapidKeys.privateKey) {
      logger.warn(
        "VAPID keys not configured. Push notifications will be disabled."
      );
      return;
    }

    webpush.setVapidDetails(
      "mailto:" + (process.env.SMTP_FROM || "noreply@valuva.com"),
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey
    );

    logger.info("Push notification service initialized");
  }

  /**
   * Subscribe user to push notifications
   */
  static async subscribeUser(
    userId: string,
    subscription: webpush.PushSubscription
  ) {
    try {
      await prisma.pushSubscription.upsert({
        where: {
          userId_endpoint: {
            userId,
            endpoint: subscription.endpoint,
          },
        },
        update: {
          keys: subscription.keys as any,
          updatedAt: new Date(),
        },
        create: {
          userId,
          endpoint: subscription.endpoint,
          keys: subscription.keys as any,
        },
      });

      logger.info("User subscribed to push notifications", {
        userId,
        endpoint: subscription.endpoint,
      });
    } catch (error) {
      logger.error("Failed to subscribe user to push notifications", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Unsubscribe user from push notifications
   */
  static async unsubscribeUser(userId: string, endpoint: string) {
    try {
      await prisma.pushSubscription.deleteMany({
        where: {
          userId,
          endpoint,
        },
      });

      logger.info("User unsubscribed from push notifications", {
        userId,
        endpoint,
      });
    } catch (error) {
      logger.error("Failed to unsubscribe user from push notifications", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send push notification to user
   */
  static async sendNotification(
    userId: string,
    title: string,
    body: string,
    data?: any
  ) {
    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });

      if (subscriptions.length === 0) {
        logger.debug("No push subscriptions found for user", { userId });
        return;
      }

      const payload = JSON.stringify({
        title,
        body,
        icon: "/valuvaLogo.png",
        badge: "/valuvaLogo.png",
        data: data || {},
      });

      const results = await Promise.allSettled(
        subscriptions.map(async (subscription) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: subscription.endpoint,
                keys: subscription.keys as any,
              },
              payload
            );
            return { success: true, endpoint: subscription.endpoint };
          } catch (error: any) {
            // If subscription is invalid, remove it
            if (error.statusCode === 410 || error.statusCode === 404) {
              await this.unsubscribeUser(userId, subscription.endpoint);
            }
            throw error;
          }
        })
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;

      logger.info("Push notification sent", {
        userId,
        title,
        successful,
        total: subscriptions.length,
      });
    } catch (error) {
      logger.error("Failed to send push notification", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send order update notification
   */
  static async sendOrderUpdate(
    userId: string,
    orderNumber: string,
    status: string
  ) {
    await this.sendNotification(
      userId,
      "Order Update",
      `Your order #${orderNumber} status: ${status}`,
      {
        type: "order_update",
        orderNumber,
        status,
        url: `/dashboard/orders/${orderNumber}`,
      }
    );
  }

  /**
   * Send promotional notification
   */
  static async sendPromotionalNotification(
    userId: string,
    title: string,
    message: string,
    url?: string
  ) {
    await this.sendNotification(userId, title, message, {
      type: "promotional",
      url: url || "/shop",
    });
  }

  /**
   * Send price drop alert
   */
  static async sendPriceDropAlert(
    userId: string,
    productName: string,
    productSlug: string
  ) {
    await this.sendNotification(
      userId,
      "Price Drop Alert!",
      `${productName} price has dropped`,
      {
        type: "price_drop",
        productSlug,
        url: `/products/${productSlug}`,
      }
    );
  }

  /**
   * Send back in stock notification
   */
  static async sendBackInStockAlert(
    userId: string,
    productName: string,
    productSlug: string
  ) {
    await this.sendNotification(
      userId,
      "Back in Stock!",
      `${productName} is now available`,
      {
        type: "back_in_stock",
        productSlug,
        url: `/products/${productSlug}`,
      }
    );
  }
}
