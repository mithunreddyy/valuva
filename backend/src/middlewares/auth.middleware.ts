// File: src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
  return res.status(401).json({ success: false, message: "No token provided" });
}
