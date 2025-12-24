import { UserRole } from "@prisma/client";
import { NextFunction, Response } from "express";
import { ERROR_MESSAGES } from "../config/constants";
import { ForbiddenError } from "../utils/error.util";
import { AuthRequest } from "./auth.middleware";

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};
