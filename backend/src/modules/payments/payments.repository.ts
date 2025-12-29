import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../config/database";

export class PaymentsRepository {
  async findPaymentByOrderId(orderId: string) {
    return prisma.payment.findUnique({
      where: { orderId },
    });
  }

  async updatePaymentStatusByOrderId(
    orderId: string,
    status: PaymentStatus,
    transactionId?: string,
    gatewayResponse?: unknown
  ) {
    return prisma.payment.update({
      where: { orderId },
      data: {
        status,
        ...(typeof transactionId === "string" ? { transactionId } : {}),
        ...(typeof gatewayResponse !== "undefined"
          ? { paymentGatewayResponse: gatewayResponse as any }
          : {}),
        ...(status === "COMPLETED" ? { paidAt: new Date() } : {}),
        ...(status === "REFUNDED" ? { refundedAt: new Date() } : {}),
      },
    });
  }

  async updatePaymentStatusByTransactionId(
    transactionId: string,
    status: PaymentStatus,
    gatewayResponse?: unknown
  ) {
    return prisma.payment.update({
      where: { transactionId },
      data: {
        status,
        ...(typeof gatewayResponse !== "undefined"
          ? { paymentGatewayResponse: gatewayResponse as any }
          : {}),
        ...(status === "COMPLETED" ? { paidAt: new Date() } : {}),
        ...(status === "REFUNDED" ? { refundedAt: new Date() } : {}),
      },
    });
  }

  async findPaymentByRazorpayOrderId(razorpayOrderId: string) {
    // Search for payment with razorpay_order_id in paymentGatewayResponse
    // Using JSON filtering
    const payments = await prisma.payment.findMany({
      where: {
        paymentGatewayResponse: {
          path: ["razorpay_order_id"],
          equals: razorpayOrderId,
        },
      },
      include: {
        order: true,
      },
    });

    // Fallback: if JSON path doesn't work, search all payments
    if (payments.length === 0) {
      const allPayments = await prisma.payment.findMany({
        include: {
          order: true,
        },
      });

      for (const payment of allPayments) {
        const gatewayResponse = payment.paymentGatewayResponse as any;
        if (
          gatewayResponse &&
          (gatewayResponse.razorpay_order_id === razorpayOrderId ||
            gatewayResponse.id === razorpayOrderId)
        ) {
          return payment;
        }
      }
    }

    return payments[0] || null;
  }
}
