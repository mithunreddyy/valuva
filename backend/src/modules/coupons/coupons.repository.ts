import { prisma } from "../../config/database";

export class CouponsRepository {
  async findActiveByCode(code: string) {
    const now = new Date();
    return prisma.coupon.findFirst({
      where: {
        code,
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gte: now },
      },
    });
  }

  async listActive(skip: number, take: number) {
    const now = new Date();
    const [coupons, total] = await prisma.$transaction([
      prisma.coupon.findMany({
        where: {
          isActive: true,
          startsAt: { lte: now },
          expiresAt: { gte: now },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.coupon.count({
        where: {
          isActive: true,
          startsAt: { lte: now },
          expiresAt: { gte: now },
        },
      }),
    ]);

    return { coupons, total };
  }
}
