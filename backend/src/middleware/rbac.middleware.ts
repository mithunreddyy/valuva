import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "../config/constants";
import { ForbiddenError } from "../utils/error.util";
import { AuthRequest } from "./auth.middleware";

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (!roles.includes(authReq.user.role as UserRole)) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};
