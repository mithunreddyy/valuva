// File: src/middleware/role.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient role" });
    }
    next();
  };
}
