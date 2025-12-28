import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/database";
import { NotFoundError, ValidationError } from "../../utils/error.util";

export class ReturnsService {
  async createReturnRequest(
    userId: string,
    orderId: string,
    orderItemIds: string[],
    reason: string,
    description?: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundError("Order not found");
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new ValidationError("Only delivered orders can be returned");
    }

    // Check if return already exists
    const existingReturn = await prisma.returnRequest.findFirst({
      where: {
        orderId,
        status: {
          in: ["PENDING", "APPROVED", "PROCESSING"],
        },
      },
    });

    if (existingReturn) {
      throw new ValidationError("Return request already exists for this order");
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        userId,
        orderId,
        orderItemIds: JSON.stringify(orderItemIds), // Store as JSON string
        reason,
        description,
        status: "PENDING",
      },
    });

    return returnRequest;
  }

  async getUserReturns(userId: string) {
    const returns = await prisma.returnRequest.findMany({
      where: { userId },
      include: {
        order: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        images: {
                          where: { isPrimary: true },
                          take: 1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return returns;
  }

  async getAllReturns(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [returns, total] = await Promise.all([
      prisma.returnRequest.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          order: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.returnRequest.count(),
    ]);

    return {
      data: returns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateReturnStatus(
    returnId: string,
    status: "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED",
    adminNotes?: string
  ) {
    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: returnId },
    });

    if (!returnRequest) {
      throw new NotFoundError("Return request not found");
    }

    return prisma.returnRequest.update({
      where: { id: returnId },
      data: { status, adminNotes },
    });
  }
}
