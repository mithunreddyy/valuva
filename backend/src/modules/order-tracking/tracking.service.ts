import { OrderTrackingRepository } from "./tracking.repository";
import { NotFoundError, UnauthorizedError } from "../../utils/error.util";
import { OrderTrackingResponse, OrderTrackingTimeline } from "./tracking.types";
import { OrderStatus } from "@prisma/client";

export class OrderTrackingService {
  private repository: OrderTrackingRepository;

  constructor() {
    this.repository = new OrderTrackingRepository();
  }

  async trackOrder(
    orderNumber: string,
    userId: string
  ): Promise<OrderTrackingResponse> {
    const order = await this.repository.findOrderByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("You can only track your own orders");
    }

    return this.formatTrackingResponse(order);
  }

  async trackOrderPublic(
    orderNumber: string,
    email: string
  ): Promise<OrderTrackingResponse> {
    const order = await this.repository.findOrderByNumberAndEmail(
      orderNumber,
      email
    );

    if (!order) {
      throw new NotFoundError("Order not found with provided details");
    }

    return this.formatTrackingResponse(order);
  }

  async updateOrderTracking(orderId: string, data: any) {
    const order = await this.repository.findOrderByOrderNumber(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Update order
    await this.repository.updateOrderTracking(orderId, data);

    // Add tracking update if status changed
    if (data.status && data.status !== order.status) {
      await this.repository.addTrackingUpdate({
        orderId,
        status: data.status,
        location: data.currentLocation || "Processing Center",
        description: this.getStatusDescription(data.status),
        timestamp: new Date(),
      });
    }

    // Send notification to customer (implement this later)
    // await this.sendTrackingNotification(order.userId, data);

    return this.trackOrder(order.orderNumber, order.userId);
  }

  async addTrackingUpdate(
    orderId: string,
    status: string,
    location: string,
    description: string,
    timestamp?: Date
  ) {
    const order = await this.repository.findOrderByOrderNumber(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    await this.repository.addTrackingUpdate({
      orderId,
      status,
      location,
      description,
      timestamp,
    });

    return { success: true, message: "Tracking update added" };
  }

  async getAllActiveOrders() {
    const orders = await this.repository.getAllActiveOrders();

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email,
      status: order.status,
      total: order.total,
      trackingNumber: order.trackingNumber,
      shippingCity: order.shippingAddress.city,
      createdAt: order.createdAt,
    }));
  }

  private async formatTrackingResponse(
    order: any
  ): Promise<OrderTrackingResponse> {
    const updates = await this.repository.getTrackingUpdates(order.id);

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        estimatedDelivery: this.calculateEstimatedDelivery(
          order.createdAt,
          order.status
        ),
        total: Number(order.total),
      },
      shipping: {
        trackingNumber: order.trackingNumber,
        carrierName: this.getCarrierName(order.trackingNumber),
        currentLocation:
          updates[0]?.location || this.getCurrentLocation(order.status),
        shippingAddress: {
          fullName: order.shippingAddress.fullName,
          addressLine1: order.shippingAddress.addressLine1,
          addressLine2: order.shippingAddress.addressLine2,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.postalCode,
          phone: order.shippingAddress.phone,
        },
      },
      timeline: this.generateTimeline(order.status, order.createdAt, updates),
      updates: updates.map((update) => ({
        id: update.id,
        status: update.status,
        location: update.location,
        description: update.description,
        timestamp: new Date(update.timestamp),
      })),
      items: order.items.map((item: any) => ({
        productName: item.variant.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        image: item.variant.product.images[0]?.url,
      })),
    };
  }

  private generateTimeline(
    currentStatus: OrderStatus,
    orderDate: Date,
    updates: any[]
  ): OrderTrackingTimeline[] {
    const statusFlow = [
      {
        status: "PENDING",
        label: "Order Placed",
        description: "Your order has been received",
      },
      {
        status: "PROCESSING",
        label: "Processing",
        description: "We are preparing your order",
      },
      {
        status: "SHIPPED",
        label: "Shipped",
        description: "Your order is on the way",
      },
      {
        status: "OUT_FOR_DELIVERY",
        label: "Out for Delivery",
        description: "Order is out for delivery",
      },
      {
        status: "DELIVERED",
        label: "Delivered",
        description: "Order has been delivered",
      },
    ];

    const statusIndex = statusFlow.findIndex((s) => s.status === currentStatus);

    return statusFlow.map((step, index) => {
      const update = updates.find((u) => u.status === step.status);

      return {
        status: step.status,
        label: step.label,
        description: step.description,
        timestamp: update?.timestamp || (index === 0 ? orderDate : undefined),
        isCompleted: index <= statusIndex,
        isCurrent: index === statusIndex,
        location: update?.location,
      };
    });
  }

  private calculateEstimatedDelivery(
    orderDate: Date,
    status: OrderStatus
  ): Date {
    const days = status === "SHIPPED" ? 3 : 5;
    const estimated = new Date(orderDate);
    estimated.setDate(estimated.getDate() + days);
    return estimated;
  }

  private getCarrierName(trackingNumber?: string): string {
    if (!trackingNumber) return "Delhivery";

    // Detect carrier from tracking number format
    if (trackingNumber.startsWith("1Z")) return "UPS";
    if (trackingNumber.length === 12) return "FedEx";
    if (trackingNumber.length === 22) return "USPS";

    return "Delhivery";
  }

  private getCurrentLocation(status: OrderStatus): string {
    const locations: Record<string, string> = {
      PENDING: "Warehouse - Mumbai",
      PROCESSING: "Processing Center - Mumbai",
      SHIPPED: "In Transit",
      OUT_FOR_DELIVERY: "Local Delivery Hub",
      DELIVERED: "Delivered",
      CANCELLED: "Order Cancelled",
      REFUNDED: "Refund Processed",
    };

    return locations[status] || "Processing";
  }

  private getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      PENDING: "Order received and awaiting processing",
      PROCESSING: "Order is being prepared for shipment",
      SHIPPED: "Order has been picked up by courier",
      OUT_FOR_DELIVERY: "Order is out for delivery to your address",
      DELIVERED: "Order has been successfully delivered",
      CANCELLED: "Order has been cancelled",
      REFUNDED: "Refund has been processed",
    };

    return descriptions[status] || "Order status updated";
  }
}
