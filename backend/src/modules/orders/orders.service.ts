import { PaymentMethod, OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ERROR_MESSAGES } from "../../config/constants";
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { AnalyticsUtil, AnalyticsEventType } from "../../utils/analytics.util";
import { AuditLogUtil, AuditAction } from "../../utils/audit-log.util";
import { InventoryLockUtil } from "../../utils/inventory-lock.util";
import { OrderStateMachine } from "../../utils/order-state-machine.util";
import { OrderUtil } from "../../utils/order.util";
import { OrdersRepository } from "./orders.repository";
import { prisma } from "../../config/database";
import { logger } from "../../utils/logger.util";

const TAX_RATE = 0.18;
const SHIPPING_COST = new Decimal(50);
const FREE_SHIPPING_THRESHOLD = new Decimal(1000);

export class OrdersService {
  private repository: OrdersRepository;

  constructor() {
    this.repository = new OrdersRepository();
  }

  async createOrder(
    userId: string,
    shippingAddressId: string,
    billingAddressId: string,
    paymentMethod: PaymentMethod,
    couponCode?: string,
    notes?: string,
    ipAddress?: string,
    _userAgent?: string
  ) {
    const shippingAddress = await this.repository.getAddress(
      shippingAddressId,
      userId
    );
    if (!shippingAddress) {
      throw new NotFoundError("Shipping address not found");
    }

    const billingAddress = await this.repository.getAddress(
      billingAddressId,
      userId
    );
    if (!billingAddress) {
      throw new NotFoundError("Billing address not found");
    }

    const cart = await this.repository.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new ValidationError(ERROR_MESSAGES.CART_EMPTY);
    }

    // Lock and reserve inventory for all items (prevents race conditions)
    const inventoryLocks: Array<{ variantId: string; quantity: number }> = [];
    
    try {
      for (const item of cart.items) {
        if (!item.variant.isActive) {
          throw new ValidationError(
            `Product ${item.variant.sku} is no longer available`
          );
        }

        // Lock inventory atomically
        const locked = await InventoryLockUtil.lockAndReserveInventory(
          item.variantId,
          item.quantity,
          5000 // 5 second timeout
        );

        if (!locked) {
          // Release already locked inventory
          for (const lock of inventoryLocks) {
            await InventoryLockUtil.releaseInventory(lock.variantId, lock.quantity);
          }
          throw new ValidationError(
            `Insufficient stock for ${item.variant.sku}. Please try again.`
          );
        }

        inventoryLocks.push({
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
    } catch (error) {
      // Release all locks if order creation fails
      for (const lock of inventoryLocks) {
        await InventoryLockUtil.releaseInventory(lock.variantId, lock.quantity);
      }
      throw error;
    }

    let subtotal = new Decimal(0);
    const items = cart.items.map((item) => {
      const itemSubtotal = new Decimal(item.variant.price).mul(item.quantity);
      subtotal = subtotal.add(itemSubtotal);
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant.price,
      };
    });

    let discount = new Decimal(0);
    if (couponCode) {
      const coupon = await this.repository.getCoupon(couponCode);
      if (!coupon) {
        throw new ValidationError(ERROR_MESSAGES.INVALID_COUPON);
      }

      if (coupon.minPurchase && subtotal.lessThan(coupon.minPurchase)) {
        throw new ValidationError(
          `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`
        );
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new ValidationError("Coupon usage limit exceeded");
      }

      if (coupon.discountType === "PERCENTAGE") {
        discount = subtotal.mul(coupon.discountValue).div(100);
        if (coupon.maxDiscount && discount.greaterThan(coupon.maxDiscount)) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
    }

    const afterDiscount = subtotal.sub(discount);
    const shippingCost = afterDiscount.greaterThanOrEqualTo(
      FREE_SHIPPING_THRESHOLD
    )
      ? new Decimal(0)
      : SHIPPING_COST;

    const tax = afterDiscount.mul(TAX_RATE);
    const total = afterDiscount.add(tax).add(shippingCost);

    const orderNumber = OrderUtil.generateOrderNumber();

    const order = await this.repository.createOrder({
      userId,
      orderNumber,
      items,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      subtotal,
      discount,
      tax,
      shippingCost,
      total,
      couponCode,
      notes,
    });

    await this.repository.clearCart(cart.id);

    // Create initial tracking update
    await prisma.orderTrackingUpdate.create({
      data: {
        orderId: order.id,
        status: OrderStatus.PENDING,
        location: "Order Placed",
        description: "Your order has been placed and is being processed.",
      },
    });

    // Send order confirmation email (async, don't block)
    try {
      const { EmailNotificationService } = await import("../notifications/email.service");
      const orderWithUser = await this.repository.findOrderById(order.id, userId);
      if (orderWithUser) {
        // Get user data
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (user && orderWithUser) {
          const orderWithUserData = { ...orderWithUser, user };
          EmailNotificationService.sendOrderConfirmation(orderWithUserData).catch(
            (error) => {
              logger.error("Failed to send order confirmation email", {
                orderId: order.id,
                error: error instanceof Error ? error.message : String(error),
              });
            }
          );
        }
      }
    } catch (error) {
      // Don't fail order creation if email fails
      logger.error("Error sending order confirmation email", {
        orderId: order.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Audit log
    await AuditLogUtil.logOrder(
      userId,
      order.id,
      AuditAction.CREATE,
      {
        orderNumber: order.orderNumber,
        total: order.total.toString(),
        itemCount: order.items.length,
        paymentMethod,
      },
      ipAddress
    );

    logger.info("Order created successfully", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId,
      total: order.total.toString(),
    });

    return order;
  }

  async getUserOrders(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { orders, total } = await this.repository.findUserOrders(
      userId,
      skip,
      limit
    );

    return {
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        itemCount: order.items.length,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          product: {
            name: item.variant.product.name,
            image: item.variant.product.images[0]?.url || null,
          },
          quantity: item.quantity,
        })),
      })),
      total,
    };
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.repository.findOrderById(orderId, userId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    return order;
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await this.repository.findOrderById(orderId, userId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Use state machine to validate transition
    OrderStateMachine.validateTransition(
      order.status,
      OrderStatus.CANCELLED,
      reason || "User requested cancellation"
    );

    // Update order status
    await this.repository.updateOrderStatus(orderId, OrderStatus.CANCELLED);

    // Restore inventory
    await this.repository.restoreInventory(orderId);

    // Create tracking update
    await prisma.orderTrackingUpdate.create({
      data: {
        orderId: order.id,
        status: OrderStatus.CANCELLED,
        location: "Order Cancelled",
        description: reason || "Your order has been cancelled.",
      },
    });

    // Track analytics
    await AnalyticsUtil.trackEvent({
      userId,
      eventType: AnalyticsEventType.ORDER_CANCELLED,
      properties: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        reason: reason || "User requested",
      },
    });

    // Audit log
    await AuditLogUtil.logOrder(
      userId,
      order.id,
      AuditAction.UPDATE,
      {
        status: OrderStatus.CANCELLED,
        reason: reason || "User requested cancellation",
      }
    );

    return this.repository.findOrderById(orderId, userId);
  }
}
