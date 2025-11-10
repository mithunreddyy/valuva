import { NextFunction, Request, Response } from "express";

/**
 * Admin Middleware
 * ----------------
 * Ensures that only admin-level users can access protected routes.
 * Depends on req.user being set by authMiddleware.
 */
export default function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
}
