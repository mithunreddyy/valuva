import { Decimal } from "@prisma/client/runtime/library";
import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger.util";

interface ShopifyPaymentSession {
  id: string;
  status: string;
  payment_url: string;
  amount: string;
  currency: string;
}

interface ShopifyPaymentResponse {
  payment: {
    id: string;
    status: "pending" | "success" | "failed";
    amount: string;
    currency: string;
    customer_id?: string;
    order_id?: string;
    transaction_id?: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
  };
}

interface CreatePaymentParams {
  orderId: string;
  amount: Decimal;
  currency?: string;
  customerEmail: string;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

export class ShopifyPaymentService {
  private client: AxiosInstance;
  private shopDomain: string;
  private accessToken: string;
  private apiVersion = "2024-01";

  constructor() {
    this.shopDomain = env.SHOPIFY_SHOP_DOMAIN;
    this.accessToken = env.SHOPIFY_ACCESS_TOKEN;

    this.client = axios.create({
      baseURL: `https://${this.shopDomain}/admin/api/${this.apiVersion}`,
      headers: {
        "X-Shopify-Access-Token": this.accessToken,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  /**
   * Create a payment session with Shopify
   */
  async createPaymentSession(
    params: CreatePaymentParams
  ): Promise<ShopifyPaymentSession> {
    try {
      const response = await this.client.post("/checkouts.json", {
        checkout: {
          line_items: [
            {
              title: `Order ${params.orderId}`,
              price: params.amount.toString(),
              quantity: 1,
            },
          ],
          email: params.customerEmail,
          currency: params.currency || "INR",
          note: `Order ID: ${params.orderId}`,
          note_attributes: [
            {
              name: "order_id",
              value: params.orderId,
            },
            ...(params.metadata
              ? Object.entries(params.metadata).map(([name, value]) => ({
                  name,
                  value: String(value),
                }))
              : []),
          ],
        },
      });

      const checkout = response.data.checkout;

      return {
        id: checkout.token,
        status: "pending",
        payment_url: checkout.web_url,
        amount: checkout.total_price,
        currency: checkout.currency,
      };
    } catch (error) {
      logger.error("Shopify payment session creation failed", {
        error: error instanceof Error ? error.message : String(error),
        orderId: params.orderId,
      });
      throw new Error("Failed to create payment session");
    }
  }

  /**
   * Verify payment status with Shopify
   */
  async verifyPayment(checkoutToken: string): Promise<ShopifyPaymentResponse> {
    try {
      const response = await this.client.get(
        `/checkouts/${checkoutToken}.json`
      );
      const checkout = response.data.checkout;

      // Check if checkout is completed
      const isPaid =
        checkout.financial_status === "paid" ||
        checkout.financial_status === "partially_paid";

      return {
        payment: {
          id: checkout.token,
          status: isPaid
            ? "success"
            : checkout.financial_status === "pending"
              ? "pending"
              : "failed",
          amount: checkout.total_price,
          currency: checkout.currency,
          customer_id: checkout.customer?.id,
          order_id: checkout.order_id,
          transaction_id: checkout.token,
          payment_method: checkout.payment_gateway_names?.[0] || "unknown",
          created_at: checkout.created_at,
          updated_at: checkout.updated_at,
        },
      };
    } catch (error) {
      logger.error("Payment verification failed", {
        error: error instanceof Error ? error.message : String(error),
        checkoutToken,
      });
      throw new Error("Failed to verify payment");
    }
  }

  /**
   * Process refund through Shopify
   */
  async refundPayment(
    orderId: string,
    amount: Decimal,
    reason?: string
  ): Promise<{ success: boolean; refund_id: string }> {
    try {
      // Find the order in Shopify
      const ordersResponse = await this.client.get("/orders.json", {
        params: {
          name: orderId,
          status: "any",
        },
      });

      if (
        !ordersResponse.data.orders ||
        ordersResponse.data.orders.length === 0
      ) {
        throw new Error("Order not found in Shopify");
      }

      const shopifyOrder = ordersResponse.data.orders[0];

      // Get transactions for the order
      const transactionsResponse = await this.client.get(
        `/orders/${shopifyOrder.id}/transactions.json`
      );

      const capturedTransaction = transactionsResponse.data.transactions.find(
        (t: any) => t.kind === "capture" && t.status === "success"
      );

      if (!capturedTransaction) {
        throw new Error("No captured transaction found for refund");
      }

      // Create refund
      const refundResponse = await this.client.post(
        `/orders/${shopifyOrder.id}/refunds.json`,
        {
          refund: {
            note: reason || "Customer refund request",
            notify: true,
            transactions: [
              {
                parent_id: capturedTransaction.id,
                amount: amount.toString(),
                kind: "refund",
                gateway: capturedTransaction.gateway,
              },
            ],
          },
        }
      );

      return {
        success: true,
        refund_id: refundResponse.data.refund.id,
      };
    } catch (error) {
      logger.error("Refund failed", {
        error: error instanceof Error ? error.message : String(error),
        orderId,
        amount,
      });
      throw new Error("Failed to process refund");
    }
  }

  /**
   * Verify webhook signature from Shopify
   */
  verifyWebhookSignature(body: string, hmacHeader: string): boolean {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", env.SHOPIFY_WEBHOOK_SECRET)
      .update(body, "utf8")
      .digest("base64");

    return hash === hmacHeader;
  }

  /**
   * Get payment methods available in Shopify
   */
  async getPaymentMethods(): Promise<string[]> {
    try {
      const response = await this.client.get("/payment_gateways.json");
      return response.data.payment_gateways
        .filter((gateway: any) => gateway.enabled)
        .map((gateway: any) => gateway.name);
    } catch (error) {
      logger.error("Failed to fetch payment methods", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Create a draft order in Shopify (alternative approach)
   */
  async createDraftOrder(params: {
    orderId: string;
    items: Array<{
      title: string;
      price: string;
      quantity: number;
    }>;
    customerEmail: string;
    shippingAddress: any;
    billingAddress: any;
  }) {
    try {
      const response = await this.client.post("/draft_orders.json", {
        draft_order: {
          line_items: params.items,
          customer: {
            email: params.customerEmail,
          },
          shipping_address: params.shippingAddress,
          billing_address: params.billingAddress,
          note: `Order ID: ${params.orderId}`,
          tags: ["valuva", params.orderId],
          use_customer_default_address: false,
        },
      });

      const draftOrder = response.data.draft_order;

      return {
        id: draftOrder.id,
        invoice_url: draftOrder.invoice_url,
        order_id: draftOrder.order_id,
        status: draftOrder.status,
      };
    } catch (error) {
      logger.error("Draft order creation failed", {
        error: error instanceof Error ? error.message : String(error),
        orderData: params,
      });
      throw new Error("Failed to create draft order");
    }
  }
}
