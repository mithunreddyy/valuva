import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database";

export class AdminCouponsRepository {
  async findAll(
    skip: number,
    take: number,
    filters?: {
      search?: string;
      isActive?: string;
    }
  ) {
    const where: Prisma.CouponWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive === "true";
    }

    const [coupons, total] = await prisma.$transaction([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.coupon.count({ where }),
    ]);

    return { coupons, total };
  }

  async findById(id: string) {
    return prisma.coupon.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code },
    });
  }

  async create(data: any) {
    return prisma.coupon.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.coupon.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.coupon.delete({
      where: { id },
    });
  }
}

