import crypto from "crypto";
import { logger } from "./logger.util";

/**
 * Webhook Verification Utility
 * Verifies webhook signatures from payment gateways and external services
 * Production-ready security for webhook endpoints
 */
export class WebhookVerificationUtil {
  /**
   * Verify generic HMAC signature
   */
  static verifyHMAC(
    body: string | Buffer,
    signature: string,
    secret: string,
    algorithm: string = "sha256"
  ): boolean {
    try {
      const hmac = crypto
        .createHmac(algorithm, secret)
        .update(body as string, "utf8")
        .digest("hex");

      // Constant-time comparison
      const isValid = crypto.timingSafeEqual(
        Buffer.from(hmac),
        Buffer.from(signature)
      );

      return isValid;
    } catch (error) {
      logger.error("HMAC verification error", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Verify Stripe webhook signature
   */
  static verifyStripeWebhook(
    body: string | Buffer,
    signature: string,
    secret: string
  ): boolean {
    try {
      const elements = signature.split(",");
      const timestamp = elements.find((e) => e.startsWith("t="))?.split("=")[1];
      const signatures = elements
        .filter((e) => e.startsWith("v1="))
        .map((e) => e.split("=")[1]);

      if (!timestamp || signatures.length === 0) {
        return false;
      }

      // Check timestamp (prevent replay attacks)
      const currentTime = Math.floor(Date.now() / 1000);
      const timestampInt = parseInt(timestamp, 10);
      if (Math.abs(currentTime - timestampInt) > 300) {
        // 5 minutes tolerance
        logger.warn("Stripe webhook timestamp too old or too new", {
          timestamp: timestampInt,
          currentTime,
        });
        return false;
      }

      // Verify signature
      const signedPayload = `${timestamp}.${body}`;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(signedPayload, "utf8")
        .digest("hex");

      return signatures.some((sig) =>
        crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(sig))
      );
    } catch (error) {
      logger.error("Stripe webhook verification error", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}
