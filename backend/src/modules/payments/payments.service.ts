import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../config/database";
import { circuitBreakers } from "../../utils/circuit-breaker.util";
import { retry } from "../../utils/retry.util";
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { PaymentsRepository } from "./payments.repository";
import { ShopifyPaymentService } from "./shopify-payment.service";

export class PaymentsService {
  private repository: PaymentsRepository;
  private shopifyService: ShopifyPaymentService;

  constructor() {
    this.repository = new PaymentsRepository();
    this.shopifyService = new ShopifyPaymentService();
  }

  /**
   * Initialize payment session with Shopify
   */
  async initializePayment(
    orderId: string,
    returnUrl: string,
    cancelUrl: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.payment?.status === PaymentStatus.COMPLETED) {
      throw new ValidationError("Payment already completed for this order");
    }

    // Create payment session with Shopify
    const paymentSession = await this.shopifyService.createPaymentSession({
      orderId: order.orderNumber,
      amount: order.total,
      customerEmail: order.user.email,
      returnUrl,
      cancelUrl,
      metadata: {
        user_id: order.userId,
        order_number: order.orderNumber,
      },
    });

    // Update payment record with session details
    await this.repository.updatePaymentStatusByOrderId(
      orderId,
      PaymentStatus.PENDING,
      paymentSession.id,
      {
        payment_url: paymentSession.payment_url,
        session_id: paymentSession.id,
        initiated_at: new Date().toISOString(),
      }
    );

    return {
      sessionId: paymentSession.id,
      paymentUrl: paymentSession.payment_url,
      amount: paymentSession.amount,
      currency: paymentSession.currency,
    };
  }

  /**
   * Verify and complete payment
   */
  async confirmPayment(orderId: string, checkoutToken: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Verify payment with Shopify (with circuit breaker and retry)
    const paymentVerification = await circuitBreakers.shopify.execute(
      async () => {
        return await retry(
          async () => {
            return await this.shopifyService.verifyPayment(checkoutToken);
          },
          {
            maxAttempts: 3,
            delay: 1000,
            backoff: "exponential",
          }
        );
      },
      async () => {
        throw new ValidationError(
          "Payment verification service is temporarily unavailable. Please try again later."
        );
      }
    );

    const payment = paymentVerification.payment;

    if (payment.status === "success") {
      // Update payment status
      await this.repository.updatePaymentStatusByOrderId(
        orderId,
        PaymentStatus.COMPLETED,
        payment.transaction_id,
        {
          shopify_order_id: payment.order_id,
          payment_method: payment.payment_method,
          completed_at: payment.updated_at,
          raw_response: payment,
        }
      );

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });

      return {
        success: true,
        transactionId: payment.transaction_id,
        orderId: order.orderNumber,
      };
    } else if (payment.status === "failed") {
      await this.repository.updatePaymentStatusByOrderId(
        orderId,
        PaymentStatus.FAILED,
        payment.transaction_id,
        payment
      );

      throw new ValidationError("Payment failed");
    }

    return {
      success: false,
      status: payment.status,
    };
  }

  /**
   * Process refund
   */
  async processRefund(orderId: string, amount: Decimal, reason?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.payment?.status !== PaymentStatus.COMPLETED) {
      throw new ValidationError("Cannot refund incomplete payment");
    }

    // Process refund through Shopify
    const refundResult = await this.shopifyService.refundPayment(
      order.orderNumber,
      amount,
      reason
    );

    if (refundResult.success) {
      // Update payment status
      await this.repository.updatePaymentStatusByOrderId(
        orderId,
        PaymentStatus.REFUNDED,
        order.payment.transactionId || undefined,
        {
          refund_id: refundResult.refund_id,
          refund_amount: amount.toString(),
          refund_reason: reason,
          refunded_at: new Date().toISOString(),
        }
      );

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.REFUNDED },
      });

      return {
        success: true,
        refundId: refundResult.refund_id,
        amount: amount.toString(),
      };
    }

    throw new Error("Refund processing failed");
  }

  /**
   * Handle Shopify webhook
   */
  async handleWebhook(payload: {
    id?: string;
    orderId?: string;
    transactionId?: string;
    status?: string;
    raw?: any;
  }) {
    // Verify payment status
    if (payload.transactionId) {
      const verification = await this.shopifyService.verifyPayment(
        payload.transactionId
      );

      const status =
        verification.payment.status === "success"
          ? PaymentStatus.COMPLETED
          : verification.payment.status === "failed"
          ? PaymentStatus.FAILED
          : PaymentStatus.PENDING;

      if (payload.orderId) {
        return this.repository.updatePaymentStatusByOrderId(
          payload.orderId,
          status,
          verification.payment.transaction_id,
          verification.payment
        );
      }

      return this.repository.updatePaymentStatusByTransactionId(
        payload.transactionId,
        status,
        verification.payment
      );
    }

    throw new Error("Invalid webhook payload");
  }

  /**
   * Get available payment methods
   */
  async getAvailablePaymentMethods() {
    return this.shopifyService.getPaymentMethods();
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string) {
    const payment = await this.repository.findPaymentByOrderId(orderId);

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    return {
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
      transactionId: payment.transactionId,
      paidAt: payment.paidAt,
      refundedAt: payment.refundedAt,
    };
  }
}
