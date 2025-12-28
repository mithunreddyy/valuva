import { Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { AuthService } from "./auth.service";

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  register = async (req: AuthRequest, res: Response): Promise<Response> => {
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const userAgent = req.headers["user-agent"] || "";

    const result = await this.service.register(
      req.body,
      ipAddress,
      userAgent
    );
    return ResponseUtil.success(
      res,
      result,
      SUCCESS_MESSAGES.REGISTER,
      HTTP_STATUS.CREATED
    );
  };

  login = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const result = await this.service.login(email, password);
    return ResponseUtil.success(res, result, SUCCESS_MESSAGES.LOGIN);
  };

  refreshToken = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { refreshToken } = req.body;
    const result = await this.service.refreshToken(refreshToken);
    return ResponseUtil.success(res, result);
  };

  logout = async (req: AuthRequest, res: Response): Promise<Response> => {
    await this.service.logout(req.user!.userId);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.LOGOUT);
  };

  forgotPassword = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { email } = req.body;
    await this.service.forgotPassword(email);
    return ResponseUtil.success(
      res,
      null,
      SUCCESS_MESSAGES.PASSWORD_RESET_REQUEST
    );
  };

  resetPassword = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { token, newPassword } = req.body;
    await this.service.resetPassword(token, newPassword);
    return ResponseUtil.success(
      res,
      null,
      SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
    );
  };

  verifyEmail = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { token } = req.query;
    await this.service.verifyEmail(token as string);
    return ResponseUtil.success(res, null, "Email verified successfully");
  };

  resendVerification = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    await this.service.resendVerificationEmail(req.user!.userId);
    return ResponseUtil.success(
      res,
      null,
      "Verification email sent successfully"
    );
  };
}
