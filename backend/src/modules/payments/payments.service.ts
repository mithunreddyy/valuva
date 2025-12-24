import { PaymentStatus } from "@prisma/client";
import { PaymentsRepository } from "./payments.repository";

export class PaymentsService {
  private repository: PaymentsRepository;

  constructor() {
    this.repository = new PaymentsRepository();
  }

  async confirmPayment(orderId: string, transactionId: string) {
    // In a real integration, you'd verify the transaction with the gateway here
    return this.repository.updatePaymentStatusByOrderId(
      orderId,
      PaymentStatus.COMPLETED,
      transactionId
    );
  }

  async handleWebhook(payload: {
    orderId?: string;
    transactionId?: string;
    status?: PaymentStatus | string;
    raw?: unknown;
  }) {
    const status =
      typeof payload.status === "string"
        ? (payload.status as PaymentStatus)
        : PaymentStatus.PENDING;

    if (payload.orderId) {
      return this.repository.updatePaymentStatusByOrderId(
        payload.orderId,
        status,
        payload.transactionId,
        payload.raw
      );
    }

    if (payload.transactionId) {
      return this.repository.updatePaymentStatusByTransactionId(
        payload.transactionId,
        status,
        payload.raw
      );
    }

    throw new Error("Invalid webhook payload: missing orderId or transactionId");
  }
}


