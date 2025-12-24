import nodemailer from "nodemailer";

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

  static async sendEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<void> {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      // In a real app you might want to throw, but for now just log to avoid crashes in dev/test
      console.warn(
        "EmailUtil.sendEmail called but SMTP env vars are not fully configured"
      );
      console.warn({ to, subject, text });
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  }
}
