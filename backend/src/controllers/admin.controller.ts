import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
function sa(res: Response, st: number, p: any) {
  res.status(st).json(p);
}

export class AdminController {
  async dashboard(req: Request, res: Response) {
    try {
      const data = await adminService.dashboard();
      sa(res, 200, { success: true, message: "Dashboard", data });
    } catch (err: any) {
      sa(res, 500, { success: false, message: err.message });
    }
  }

  async analytics(req: Request, res: Response) {
    try {
      const data = await adminService.analytics();
      sa(res, 200, { success: true, message: "Analytics", data });
    } catch (err: any) {
      sa(res, 500, { success: false, message: err.message });
    }
  }

  async users(req: Request, res: Response) {
    try {
      const data = await adminService.users(req.query);
      sa(res, 200, { success: true, message: "Users", data });
    } catch (err: any) {
      sa(res, 500, { success: false, message: err.message });
    }
  }

  async products(req: Request, res: Response) {
    try {
      const data = await adminService.products(req.query);
      sa(res, 200, { success: true, message: "Products", data });
    } catch (err: any) {
      sa(res, 500, { success: false, message: err.message });
    }
  }

  async orders(req: Request, res: Response) {
    try {
      const data = await adminService.orders(req.query);
      sa(res, 200, { success: true, message: "Orders", data });
    } catch (err: any) {
      sa(res, 500, { success: false, message: err.message });
    }
  }

  async settings(req: Request, res: Response) {
    try {
      const data = await adminService.settings();
      sa(res, 200, { success: true, message: "Settings", data });
    } catch (err: any) {
      sa(res, 500, { success: false, message: err.message });
    }
  }
}

export const adminController = new AdminController();
