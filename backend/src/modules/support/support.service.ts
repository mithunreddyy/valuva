import { prisma } from "../../config/database";
import { NotFoundError } from "../../utils/error.util";

export class SupportService {
  async createTicket(
    userId: string,
    subject: string,
    message: string,
    category: string
  ) {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        message,
        category,
        status: "OPEN",
      },
    });

    return ticket;
  }

  async getUserTickets(userId: string) {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return tickets;
  }

  async getTicketById(ticketId: string, userId?: string) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    // Check if user has access
    if (userId && ticket.userId !== userId) {
      throw new NotFoundError("Ticket not found");
    }

    return ticket;
  }

  async addReply(
    ticketId: string,
    userId: string,
    message: string,
    isAdmin: boolean = false
  ) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    const reply = await prisma.ticketReply.create({
      data: {
        ticketId,
        userId,
        message,
        isAdmin,
      },
    });

    // Update ticket status if admin replies
    if (isAdmin) {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return reply;
  }

  async getAllTickets(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
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
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.supportTicket.count(),
    ]);

    return {
      data: tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateTicketStatus(
    ticketId: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  ) {
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
  }
}

