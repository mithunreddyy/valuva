import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { ValidationError } from "../utils/error.util";

export const validate = (schema: ZodObject<any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        next(new ValidationError(messages.join(", ")));
      } else {
        next(error);
      }
    }
  };
};
