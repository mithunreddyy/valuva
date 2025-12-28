import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../utils/error.util";
import { EmailUtil } from "../../utils/email.util";

export class NewsletterService {
  async subscribe(email: string) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictError("Email already subscribed");
      } else {
        // Reactivate subscription
        return prisma.user.update({
          where: { email },
          data: { isActive: true },
        });
      }
    }

    const subscription = await prisma.user.create({
      data: { email, password: "", firstName: "", lastName: "" },
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

    // TODO: Verify token if provided
    if (token && subscription.passwordResetToken !== token) {
      throw new NotFoundError("Invalid unsubscribe token");
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

