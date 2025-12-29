import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { AdminMFAService } from "./admin-mfa.service";

export class AdminMFAController {
  private service: AdminMFAService;

  constructor() {
    this.service = new AdminMFAService();
  }

  setupMFA = async (req: AuthRequest, res: Response): Promise<Response> => {
    const adminId = req.user!.userId;
    const result = await this.service.setupMFA(adminId);
    return ResponseUtil.success(res, result);
  };

  verifyAndEnableMFA = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const adminId = req.user!.userId;
    const { token, secret, backupCodes } = req.body;
    await this.service.verifyAndEnableMFA(adminId, token, secret, backupCodes);
    return ResponseUtil.success(res, null, "MFA enabled successfully");
  };

  disableMFA = async (req: AuthRequest, res: Response): Promise<Response> => {
    const adminId = req.user!.userId;
    const { password } = req.body;
    await this.service.disableMFA(adminId, password);
    return ResponseUtil.success(res, null, "MFA disabled successfully");
  };

  regenerateBackupCodes = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const adminId = req.user!.userId;
    const result = await this.service.regenerateBackupCodes(adminId);
    return ResponseUtil.success(res, result, "Backup codes regenerated");
  };
}
