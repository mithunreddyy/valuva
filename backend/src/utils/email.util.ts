import nodemailer from "nodemailer";
import { circuitBreakers } from "./circuit-breaker.util";
import { retry } from "./retry.util";
import { logger } from "./logger.util";
import { renderEmailTemplate } from "./email-templates";

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: React.ReactElement;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailUtil {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  /**
   * Send email with support for HTML templates
   * Production-ready email sending with template rendering
   */
  static async sendEmail(options: EmailOptions): Promise<void>;
  static async sendEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<void>;
  static async sendEmail(
    toOrOptions: string | EmailOptions,
    subject?: string,
    text?: string
  ): Promise<void> {
    // Normalize parameters
    let options: EmailOptions;
    if (typeof toOrOptions === "string") {
      options = {
        to: toOrOptions,
        subject: subject!,
        text: text,
      };
    } else {
      options = toOrOptions;
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      logger.warn("EmailUtil.sendEmail called but SMTP env vars are not fully configured", {
        to: options.to,
        subject: options.subject,
      });
      if (process.env.NODE_ENV === "production") {
        throw new Error("SMTP configuration is required in production");
      }
      return;
    }

    // Render HTML template if provided
    let html = options.html;
    if (options.template && !html) {
      try {
        html = await renderEmailTemplate(options.template);
      } catch (error) {
        logger.error("Failed to render email template", {
          error: error instanceof Error ? error.message : String(error),
        });
        // Fallback to text if template rendering fails
      }
    }

    // Use circuit breaker and retry logic for email sending
    await circuitBreakers.email.execute(
      async () => {
        await retry(
          async () => {
            await this.transporter.sendMail({
              from: process.env.SMTP_FROM || process.env.SMTP_USER,
              to: options.to,
              subject: options.subject,
              text: options.text || (html ? undefined : "Please enable HTML to view this email."),
              html: html,
              attachments: options.attachments,
            });

            logger.info("Email sent successfully", {
              to: options.to,
              subject: options.subject,
              hasHtml: !!html,
            });
          },
          {
            maxAttempts: 3,
            delay: 1000,
            backoff: "exponential",
            retryable: (error: any) => {
              // Retry on network errors and 5xx responses
              return (
                error?.code === "ECONNRESET" ||
                error?.code === "ETIMEDOUT" ||
                error?.response?.status >= 500
              );
            },
          }
        );
      },
      async () => {
        // Fallback: queue email for retry
        const { queueEmail } = await import("../jobs/email-queue.job");
        queueEmail(options);
        logger.info("Email queued for retry", {
          to: options.to,
          subject: options.subject,
        });
        // Don't throw - email is queued for later delivery
      }
    );
  }
}
