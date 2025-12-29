import crypto from "crypto";
import { prisma } from "../../config/database";
import { env } from "../../config/env";
import { EmailUtil } from "../../utils/email.util";
import { ConflictError, NotFoundError } from "../../utils/error.util";

/**
 * Generate secure unsubscribe token
 * Production-ready token generation using crypto
 */
function generateUnsubscribeToken(email: string): string {
  const secret = env.JWT_SECRET || process.env.JWT_SECRET || "";
  const data = `${email}:${Date.now()}`;
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex")
    .substring(0, 32);
}

/**
 * Verify unsubscribe token
 * Production-ready token verification
 */
function verifyUnsubscribeToken(
  email: string,
  token: string,
  storedToken: string | null
): boolean {
  if (!storedToken) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
}

export class NewsletterService {
  async subscribe(email: string) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    // Generate unsubscribe token
    const unsubscribeToken = generateUnsubscribeToken(email);

    if (existing) {
      if (existing.isActive) {
        throw new ConflictError("Email already subscribed");
      } else {
        // Reactivate subscription and update token
        const updated = await prisma.user.update({
          where: { email },
          data: {
            isActive: true,
            passwordResetToken: unsubscribeToken,
            passwordResetExpires: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ), // 1 year expiry
          },
        });

        // Send welcome email
        await EmailUtil.sendEmail(
          email,
          "Welcome back to Valuva Newsletter",
          "Thank you for resubscribing to our newsletter!"
        );

        return updated;
      }
    }

    const subscription = await prisma.user.create({
      data: {
        email,
        password: "",
        firstName: "",
        lastName: "",
        passwordResetToken: unsubscribeToken,
        passwordResetExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
      },
    });

    // Send welcome email
    await EmailUtil.sendEmail(
      email,
      "Welcome to Valuva Newsletter",
      "Thank you for subscribing to our newsletter!"
    );

    return subscription;
  }

  async unsubscribe(email: string, token?: string) {
    const subscription = await prisma.user.findUnique({
      where: { email },
    });

    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    // Production-ready token verification
    if (token) {
      // Check if token is expired
      if (
        !subscription.passwordResetExpires ||
        subscription.passwordResetExpires < new Date()
      ) {
        throw new NotFoundError("Unsubscribe token has expired");
      }

      // Verify token
      if (
        !subscription.passwordResetToken ||
        !verifyUnsubscribeToken(email, token, subscription.passwordResetToken)
      ) {
        throw new NotFoundError("Invalid unsubscribe token");
      }
    }

    return prisma.user.update({
      where: { email },
      data: { isActive: false },
    });
  }

  async getAllSubscriptions(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [subscriptions, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
