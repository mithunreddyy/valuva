import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "../config/constants";
import { UnauthorizedError } from "../utils/error.util";
import { JWTUtil } from "../utils/jwt.util";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const decoded = JWTUtil.verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    next(new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN));
  }
};
