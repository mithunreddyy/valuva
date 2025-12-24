import { Response } from "express";
import { SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { PaginationUtil } from "../../utils/pagination.util";
import { ResponseUtil } from "../../utils/response.util";
import { UsersService } from "./users.service";

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    const user = await this.service.getProfile(req.user!.userId);
    return ResponseUtil.success(res, user);
  };

  updateProfile = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const user = await this.service.updateProfile(req.user!.userId, req.body);
    return ResponseUtil.success(res, user, SUCCESS_MESSAGES.UPDATED);
  };

  changePassword = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { currentPassword, newPassword } = req.body;
    await this.service.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword
    );
    return ResponseUtil.success(res, null, "Password changed successfully");
  };

  getUserStats = async (req: AuthRequest, res: Response): Promise<Response> => {
    const stats = await this.service.getUserStats(req.user!.userId);
    return ResponseUtil.success(res, stats);
  };

  getAllUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getAllUsers(page, limit, req.query);
    return ResponseUtil.paginated(res, result.users, page, limit, result.total);
  };

  getUserDetails = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const user = await this.service.getUserDetails(req.params.id);
    return ResponseUtil.success(res, user);
  };

  updateUserStatus = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await this.service.updateUserStatus(id, isActive);
    return ResponseUtil.success(
      res,
      user,
      isActive ? "User activated" : "User deactivated"
    );
  };
}
