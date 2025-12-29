import { Order, Product, User } from "@prisma/client";
import { EmailUtil } from "../../utils/email.util";
import { logger } from "../../utils/logger.util";

/**
 * Email Notification Service
 * Handles all email notifications for the application
 */
export class EmailNotificationService {
  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(order: any) {
    try {
      const OrderConfirmationTemplate = (
        await import("../../utils/email-templates/order-confirmation")
      ).OrderConfirmationEmail;

      // Format order data for template
      const items =
        order.items?.map((item: any) => ({
          name: item.variant?.product?.name || "Product",
          quantity: item.quantity,
          price: `₹${Number(item.price).toLocaleString()}`,
        })) || [];

      const shippingAddress = order.shippingAddress
        ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`
        : "N/A";

      await EmailUtil.sendEmail({
        to: order.user?.email || order.userEmail,
        subject: `Order Confirmation - #${order.orderNumber}`,
        template: OrderConfirmationTemplate({
          orderNumber: order.orderNumber,
          customerName: order.user?.firstName || "Customer",
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          total: `₹${Number(order.total).toLocaleString()}`,
          items,
          shippingAddress,
          orderUrl: `${process.env.FRONTEND_URL}/dashboard/orders/${order.id}`,
        }),
      });

      logger.info("Order confirmation email sent", {
        orderId: order.id,
        email: order.user?.email || order.userEmail,
      });
    } catch (error) {
      logger.error("Failed to send order confirmation email", {
        orderId: order.id,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - email failure shouldn't break order creation
    }
  }

  /**
   * Send shipping notification email
   */
  static async sendShippingNotification(order: any, trackingNumber?: string) {
    try {
      const { OrderShippedEmail } =
        await import("../../utils/email-templates/order-shipped");

      await EmailUtil.sendEmail({
        to: order.user?.email || order.userEmail,
        subject: `Your Order #${order.orderNumber} Has Shipped`,
        template: OrderShippedEmail({
          orderNumber: order.orderNumber,
          customerName: order.user?.firstName || "Customer",
          trackingNumber: trackingNumber,
          estimatedDelivery: "3-5 business days",
          trackingUrl: `${process.env.FRONTEND_URL}/dashboard/orders/${order.id}`,
        }),
      });

      logger.info("Shipping notification email sent", {
        orderId: order.id,
        email: order.user?.email || order.userEmail,
        trackingNumber,
      });
    } catch (error) {
      logger.error("Failed to send shipping notification email", {
        orderId: order.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send order status update email
   */
  static async sendOrderStatusUpdate(
    order: Order & { user: User },
    status: string
  ) {
    try {
      const statusMessages: Record<string, string> = {
        PROCESSING: "Your order is being processed",
        SHIPPED: "Your order has been shipped",
        DELIVERED: "Your order has been delivered",
        CANCELLED: "Your order has been cancelled",
        REFUNDED: "Your order has been refunded",
      };

      const message =
        statusMessages[status] || "Your order status has been updated";

      await EmailUtil.sendEmail({
        to: order.user.email,
        subject: `Order Update - #${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Order Status Update</h2>
            <p>Hello ${order.user.firstName || "Customer"},</p>
            <p>${message}.</p>
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p>You can track your order at: <a href="${process.env.FRONTEND_URL}/dashboard/orders/${order.id}">View Order</a></p>
          </div>
        `,
      });

      logger.info("Order status update email sent", {
        orderId: order.id,
        email: order.user.email,
        status,
      });
    } catch (error) {
      logger.error("Failed to send order status update email", {
        orderId: order.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send abandoned cart reminder email
   */
  static async sendAbandonedCartReminder(
    user: User,
    cartItems: Array<{ product: Product; quantity: number }>
  ) {
    try {
      const itemsList = cartItems
        .map((item) => `<li>${item.product.name} x${item.quantity}</li>`)
        .join("");

      await EmailUtil.sendEmail({
        to: user.email,
        subject: "Complete Your Purchase",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Don't Forget Your Items!</h2>
            <p>Hello ${user.firstName || "Customer"},</p>
            <p>You left some items in your cart. Complete your purchase now:</p>
            <ul>${itemsList}</ul>
            <p><a href="${process.env.FRONTEND_URL}/cart" style="background: #0a0a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Complete Purchase</a></p>
          </div>
        `,
      });

      logger.info("Abandoned cart reminder email sent", {
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      logger.error("Failed to send abandoned cart reminder email", {
        userId: user.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send price drop alert email
   */
  static async sendPriceDropAlert(
    user: User,
    product: Product,
    oldPrice: number,
    newPrice: number
  ) {
    try {
      await EmailUtil.sendEmail({
        to: user.email,
        subject: `Price Drop Alert: ${product.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Price Drop Alert!</h2>
            <p>Hello ${user.firstName || "Customer"},</p>
            <p>The price of <strong>${product.name}</strong> has dropped!</p>
            <p><strong>Old Price:</strong> ₹${oldPrice.toLocaleString()}</p>
            <p><strong>New Price:</strong> ₹${newPrice.toLocaleString()}</p>
            <p><strong>You Save:</strong> ₹${(oldPrice - newPrice).toLocaleString()}</p>
            <p><a href="${process.env.FRONTEND_URL}/products/${product.slug}" style="background: #0a0a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Product</a></p>
          </div>
        `,
      });

      logger.info("Price drop alert email sent", {
        userId: user.id,
        productId: product.id,
        email: user.email,
      });
    } catch (error) {
      logger.error("Failed to send price drop alert email", {
        userId: user.id,
        productId: product.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send back in stock notification email
   */
  static async sendBackInStockNotification(user: User, product: Product) {
    try {
      await EmailUtil.sendEmail({
        to: user.email,
        subject: `${product.name} is Back in Stock!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Back in Stock!</h2>
            <p>Hello ${user.firstName || "Customer"},</p>
            <p><strong>${product.name}</strong> is now back in stock!</p>
            <p>Hurry, limited quantities available.</p>
            <p><a href="${process.env.FRONTEND_URL}/products/${product.slug}" style="background: #0a0a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Shop Now</a></p>
          </div>
        `,
      });

      logger.info("Back in stock notification email sent", {
        userId: user.id,
        productId: product.id,
        email: user.email,
      });
    } catch (error) {
      logger.error("Failed to send back in stock notification email", {
        userId: user.id,
        productId: product.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send welcome email series
   */
  static async sendWelcomeEmail(user: User) {
    try {
      const { WelcomeEmail } =
        await import("../../utils/email-templates/welcome");

      await EmailUtil.sendEmail({
        to: user.email,
        subject: "Welcome to VALUVA!",
        template: WelcomeEmail({
          customerName: user.firstName || "Customer",
          dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
        }),
      });

      logger.info("Welcome email sent", {
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      logger.error("Failed to send welcome email", {
        userId: user.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Send newsletter email
   */
  static async sendNewsletterEmail(
    recipients: User[],
    subject: string,
    content: string
  ) {
    try {
      const emailPromises = recipients.map((user) =>
        EmailUtil.sendEmail({
          to: user.email,
          subject,
          html: content,
        })
      );

      await Promise.allSettled(emailPromises);

      logger.info("Newsletter emails sent", {
        recipientCount: recipients.length,
      });
    } catch (error) {
      logger.error("Failed to send newsletter emails", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
