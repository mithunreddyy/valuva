import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { SupportService } from "./support.service";

export class SupportController {
  private service: SupportService;

  constructor() {
    this.service = new SupportService();
  }

  createTicket = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { subject, message, category } = req.body;
    const ticket = await this.service.createTicket(
      userId,
      subject,
      message,
      category
    );
    return ResponseUtil.success(
      res,
      ticket,
      "Support ticket created",
      HTTP_STATUS.CREATED
    );
  };

  getUserTickets = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const tickets = await this.service.getUserTickets(userId);
    return ResponseUtil.success(res, tickets, undefined, HTTP_STATUS.OK);
  };

  getTicketById = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    const { id } = req.params;
    const ticket = await this.service.getTicketById(id, userId);
    return ResponseUtil.success(res, ticket, undefined, HTTP_STATUS.OK);
  };

  addReply = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { id } = req.params;
    const { message } = req.body;
    const userRole = (req as AuthRequest).user?.role;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    const reply = await this.service.addReply(id, userId, message, isAdmin);
    return ResponseUtil.success(res, reply, "Reply added", HTTP_STATUS.CREATED);
  };

  getAllTickets = async (req: Request, res: Response): Promise<Response> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await this.service.getAllTickets(page, limit);
    return ResponseUtil.success(res, result, undefined, HTTP_STATUS.OK);
  };

  updateTicketStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = await this.service.updateTicketStatus(id, status);
    return ResponseUtil.success(
      res,
      ticket,
      "Ticket status updated",
      HTTP_STATUS.OK
    );
  };
}

