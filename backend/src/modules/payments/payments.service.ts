import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../config/database";
import { circuitBreakers } from "../../utils/circuit-breaker.util";
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { retry } from "../../utils/retry.util";
import { PaymentsRepository } from "./payments.repository";
import { RazorpayPaymentService } from "./razorpay-payment.service";
import { ShopifyPaymentService } from "./shopify-payment.service";

export class PaymentsService {
  private repository: PaymentsRepository;
  private shopifyService: ShopifyPaymentService;
  private razorpayService: RazorpayPaymentService;

  constructor() {
    this.repository = new PaymentsRepository();
    this.shopifyService = new ShopifyPaymentService();
    this.razorpayService = new RazorpayPaymentService();
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

  /**
   * Initialize Razorpay payment
   */
  async initializeRazorpayPayment(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.payment?.status === PaymentStatus.COMPLETED) {
      throw new ValidationError("Payment already completed for this order");
    }

    if (!this.razorpayService.isConfigured()) {
      throw new ValidationError("Razorpay is not configured");
    }

    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = this.razorpayService.convertToPaise(order.total);

    // Create Razorpay order
    const razorpayOrder = await this.razorpayService.createOrder({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        order_id: order.id,
        order_number: order.orderNumber,
        user_id: order.userId,
      },
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        contact: order.user.phone || undefined,
      },
    });

    // Update payment record with Razorpay order ID
    await this.repository.updatePaymentStatusByOrderId(
      orderId,
      PaymentStatus.PENDING,
      undefined,
      {
        razorpay_order_id: razorpayOrder.id,
        payment_gateway: "razorpay",
        initiated_at: new Date().toISOString(),
      }
    );

    return {
      orderId: razorpayOrder.id,
      amount: order.total.toString(),
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // Frontend needs this for checkout
      receipt: razorpayOrder.receipt,
    };
  }

  /**
   * Verify and complete Razorpay payment
   */
  async verifyRazorpayPayment(
    orderId: string,
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Verify payment signature (CRITICAL for security)
    const isValidSignature = this.razorpayService.verifyPaymentSignature(
      paymentData.razorpay_order_id,
      paymentData.razorpay_payment_id,
      paymentData.razorpay_signature
    );

    if (!isValidSignature) {
      throw new ValidationError("Invalid payment signature");
    }

    // Fetch payment details from Razorpay
    const razorpayPayment = await this.razorpayService.getPayment(
      paymentData.razorpay_payment_id
    );

    // Verify amount matches
    const expectedAmount = this.razorpayService.convertToPaise(order.total);
    if (razorpayPayment.amount !== expectedAmount) {
      throw new ValidationError("Payment amount mismatch");
    }

    // Verify order ID matches
    if (razorpayPayment.order_id !== paymentData.razorpay_order_id) {
      throw new ValidationError("Order ID mismatch");
    }

    // Check if payment is already captured
    if (razorpayPayment.status === "captured" || razorpayPayment.captured) {
      // Update payment status
      await this.repository.updatePaymentStatusByOrderId(
        orderId,
        PaymentStatus.COMPLETED,
        razorpayPayment.id,
        {
          razorpay_order_id: razorpayPayment.order_id,
          payment_method: razorpayPayment.method as PaymentMethod,
          completed_at: new Date(
            razorpayPayment.created_at * 1000
          ).toISOString(),
          raw_response: razorpayPayment,
        }
      );

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });

      return {
        success: true,
        transactionId: razorpayPayment.id,
        orderId: order.orderNumber,
        amount: this.razorpayService
          .convertFromPaise(razorpayPayment.amount)
          .toString(),
      };
    } else if (razorpayPayment.status === "authorized") {
      // Capture authorized payment
      const capturedPayment = await this.razorpayService.capturePayment(
        razorpayPayment.id,
        razorpayPayment.amount,
        razorpayPayment.currency || "INR"
      );

      // Update payment status
      await this.repository.updatePaymentStatusByOrderId(
        orderId,
        PaymentStatus.COMPLETED,
        capturedPayment.id,
        {
          razorpay_order_id: capturedPayment.order_id,
          payment_method: razorpayPayment.method as PaymentMethod,
          completed_at: new Date().toISOString(),
          raw_response: capturedPayment,
        }
      );

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });

      return {
        success: true,
        transactionId: capturedPayment.id,
        orderId: order.orderNumber,
        amount: this.razorpayService
          .convertFromPaise(Number(capturedPayment.amount))
          .toString(),
      };
    } else if (razorpayPayment.status === "failed") {
      await this.repository.updatePaymentStatusByOrderId(
        orderId,
        PaymentStatus.FAILED,
        razorpayPayment.id,
        {
          raw_response: razorpayPayment,
        }
      );

      throw new ValidationError("Payment failed");
    }

    return {
      success: false,
      status: razorpayPayment.status,
    };
  }

  /**
   * Handle Razorpay webhook
   */
  async handleRazorpayWebhook(payload: any, signature: string) {
    // Verify webhook signature
    const isValidSignature = this.razorpayService.verifyWebhookSignature(
      payload,
      signature
    );

    if (!isValidSignature) {
      throw new ValidationError("Invalid webhook signature");
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      throw new ValidationError("Invalid webhook payload");
    }

    // Find order by Razorpay order ID
    const payment = await this.repository.findPaymentByRazorpayOrderId(
      paymentEntity.order_id
    );

    if (!payment) {
      throw new NotFoundError("Payment not found for this webhook");
    }

    const order = await prisma.order.findUnique({
      where: { id: payment.orderId },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Handle different webhook events
    if (event === "payment.captured" || event === "payment.authorized") {
      // Verify amount matches
      const expectedAmount = this.razorpayService.convertToPaise(order.total);
      if (paymentEntity.amount !== expectedAmount) {
        throw new ValidationError("Payment amount mismatch in webhook");
      }

      // Update payment status
      await this.repository.updatePaymentStatusByOrderId(
        order.id,
        PaymentStatus.COMPLETED,
        paymentEntity.id,
        {
          razorpay_order_id: paymentEntity.order_id,
          payment_method: paymentEntity.method as PaymentMethod,
          completed_at: new Date(paymentEntity.created_at * 1000).toISOString(),
          raw_response: paymentEntity,
        }
      );

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PROCESSING },
      });
    } else if (event === "payment.failed") {
      await this.repository.updatePaymentStatusByOrderId(
        order.id,
        PaymentStatus.FAILED,
        paymentEntity.id,
        {
          raw_response: paymentEntity,
        }
      );
    }

    return {
      success: true,
      event,
      paymentId: paymentEntity.id,
    };
  }

  /**
   * Process Razorpay refund
   */
  async processRazorpayRefund(
    orderId: string,
    amount: Decimal,
    reason?: string
  ) {
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

    if (!order.payment.transactionId) {
      throw new ValidationError("Payment transaction ID not found");
    }

    // Convert amount to paise
    const refundAmountInPaise = this.razorpayService.convertToPaise(amount);

    // Process refund through Razorpay
    const refundResult = await this.razorpayService.processRefund(
      order.payment.transactionId,
      {
        amount: refundAmountInPaise,
        speed: "normal",
        notes: {
          reason: reason || "Customer request",
          order_id: order.id,
          order_number: order.orderNumber,
        },
      }
    );

    // Update payment status
    await this.repository.updatePaymentStatusByOrderId(
      orderId,
      PaymentStatus.REFUNDED,
      order.payment.transactionId,
      {
        refund_id: refundResult.id,
        refund_amount: amount.toString(),
        refund_reason: reason,
        refunded_at: new Date(refundResult.created_at * 1000).toISOString(),
        raw_response: refundResult,
      }
    );

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.REFUNDED },
    });

    return {
      success: true,
      refundId: refundResult.id,
      amount: amount.toString(),
    };
  }
}
