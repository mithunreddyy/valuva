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
}
