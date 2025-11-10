import { Request, Response } from "express";
import { authService } from "../services/auth.service";

function send(res: Response, status: number, payload: any) {
  res.status(status).json(payload);
}

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = await authService.register(req.body);
      send(res, 201, { success: true, message: "Registered", data });
    } catch (err: any) {
      send(res, 400, { success: false, message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body);
      send(res, 200, { success: true, message: "Logged in", data });
    } catch (err: any) {
      send(res, 401, { success: false, message: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await authService.logout(req.body || req.user);
      send(res, 200, { success: true, message: "Logged out" });
    } catch (err: any) {
      send(res, 400, { success: false, message: err.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const data = await authService.refreshToken(req.body.refreshToken);
      send(res, 200, { success: true, message: "Token refreshed", data });
    } catch (err: any) {
      send(res, 403, { success: false, message: err.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      await authService.forgotPassword(req.body.email);
      send(res, 200, { success: true, message: "Password reset requested" });
    } catch (err: any) {
      send(res, 400, { success: false, message: err.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      send(res, 200, { success: true, message: "Password reset" });
    } catch (err: any) {
      send(res, 400, { success: false, message: err.message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      await authService.verifyEmail(req.params.token);
      send(res, 200, { success: true, message: "Email verified" });
    } catch (err: any) {
      send(res, 400, { success: false, message: err.message });
    }
  }
}

export const authController = new AuthController();
