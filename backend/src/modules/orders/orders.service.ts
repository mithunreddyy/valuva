import { PaymentMethod } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ERROR_MESSAGES } from "../../config/constants";
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { OrderUtil } from "../../utils/order.util";
import { OrdersRepository } from "./orders.repository";

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
    notes?: string
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

    for (const item of cart.items) {
      if (!item.variant.isActive) {
        throw new ValidationError(
          `Product ${item.variant.sku} is no longer available`
        );
      }
      if (item.variant.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for ${item.variant.sku}. Available: ${item.variant.stock}`
        );
      }
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
}
