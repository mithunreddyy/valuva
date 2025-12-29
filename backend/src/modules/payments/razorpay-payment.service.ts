import { Decimal } from "@prisma/client/runtime/library";
import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../../config/env";
import { ValidationError } from "../../utils/error.util";

export interface RazorpayOrderOptions {
  amount: number; // Amount in paise (smallest currency unit)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayRefundOptions {
  amount?: number; // Amount in paise
  speed?: "normal" | "optimum";
  notes?: Record<string, string>;
  receipt?: string;
}

export class RazorpayPaymentService {
  private razorpay: Razorpay | null = null;

  constructor() {
    if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  /**
   * Check if Razorpay is configured
   */
  isConfigured(): boolean {
    return this.razorpay !== null;
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(options: RazorpayOrderOptions) {
    if (!this.razorpay) {
      throw new ValidationError("Razorpay is not configured");
    }

    try {
      const orderOptions: any = {
        amount: options.amount, // Amount in paise
        currency: options.currency || "INR",
        receipt: options.receipt,
        notes: options.notes || {},
      };

      if (options.customer) {
        orderOptions.notes = {
          ...orderOptions.notes,
          customer_name: options.customer.name,
          customer_email: options.customer.email,
          customer_contact: options.customer.contact,
        };
      }

      const order = await this.razorpay.orders.create(orderOptions);

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      };
    } catch (error: any) {
      throw new ValidationError(
        `Failed to create Razorpay order: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Verify payment signature
   * This is critical for security - always verify signatures
   */
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    if (!env.RAZORPAY_KEY_SECRET) {
      throw new ValidationError("Razorpay secret key is not configured");
    }

    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string | object, signature: string): boolean {
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      throw new ValidationError("Razorpay webhook secret is not configured");
    }

    const payloadString =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    const generatedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(payloadString)
      .digest("hex");

    return generatedSignature === signature;
  }

  /**
   * Fetch payment details from Razorpay
   */
  async getPayment(paymentId: string) {
    if (!this.razorpay) {
      throw new ValidationError("Razorpay is not configured");
    }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId);

      return {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        description: payment.description,
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at,
        captured: payment.captured,
        international: payment.international,
        notes: payment.notes,
      };
    } catch (error: any) {
      throw new ValidationError(
        `Failed to fetch payment: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Fetch order details from Razorpay
   */
  async getOrder(orderId: string) {
    if (!this.razorpay) {
      throw new ValidationError("Razorpay is not configured");
    }

    try {
      const order = await this.razorpay.orders.fetch(orderId);

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        attempts: order.attempts,
        created_at: order.created_at,
        notes: order.notes,
      };
    } catch (error: any) {
      throw new ValidationError(
        `Failed to fetch order: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Capture payment (for authorized payments)
   */
  async capturePayment(
    paymentId: string,
    amount: number,
    currency: string = "INR"
  ) {
    if (!this.razorpay) {
      throw new ValidationError("Razorpay is not configured");
    }

    try {
      const payment = await this.razorpay.payments.capture(
        paymentId,
        amount,
        currency
      );

      return {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        captured: payment.captured,
      };
    } catch (error: any) {
      throw new ValidationError(
        `Failed to capture payment: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Process refund
   */
  async processRefund(paymentId: string, options?: RazorpayRefundOptions) {
    if (!this.razorpay) {
      throw new ValidationError("Razorpay is not configured");
    }

    try {
      const refundOptions: any = {
        speed: options?.speed || "normal",
      };

      if (options?.amount) {
        refundOptions.amount = options.amount;
      }

      if (options?.notes) {
        refundOptions.notes = options.notes;
      }

      if (options?.receipt) {
        refundOptions.receipt = options.receipt;
      }

      const refund = await this.razorpay.payments.refund(
        paymentId,
        refundOptions
      );

      return {
        id: refund.id,
        entity: refund.entity,
        amount: refund.amount,
        currency: refund.currency,
        payment_id: refund.payment_id,
        status: refund.status,
        speed_processed: refund.speed_processed,
        receipt: refund.receipt,
        notes: refund.notes,
        created_at: refund.created_at,
      };
    } catch (error: any) {
      throw new ValidationError(
        `Failed to process refund: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Get refund details
   */
  async getRefund(refundId: string) {
    if (!this.razorpay) {
      throw new ValidationError("Razorpay is not configured");
    }

    try {
      const refund = await this.razorpay.refunds.fetch(refundId);

      return {
        id: refund.id,
        entity: refund.entity,
        amount: refund.amount,
        currency: refund.currency,
        payment_id: refund.payment_id,
        status: refund.status,
        speed_processed: refund.speed_processed,
        receipt: refund.receipt,
        notes: refund.notes,
        created_at: refund.created_at,
      };
    } catch (error: any) {
      throw new ValidationError(
        `Failed to fetch refund: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Convert Decimal amount to paise (Razorpay uses smallest currency unit)
   */
  convertToPaise(amount: Decimal): number {
    return Math.round(amount.toNumber() * 100);
  }

  /**
   * Convert paise to Decimal
   */
  convertFromPaise(paise: number): Decimal {
    return new Decimal(paise / 100);
  }
}
