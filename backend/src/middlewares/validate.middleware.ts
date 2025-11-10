import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

/**
 * Validation Middleware Factory
 * ------------------------------
 * Dynamically creates validation chains based on schema type.
 * Usage: validateMiddleware("register") inside a route.
 */

const validationSchemas: Record<string, any[]> = {
  register: [
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  login: [body("email").isEmail(), body("password").notEmpty()],
  resetPassword: [
    body("token").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  productCreate: [body("name").notEmpty(), body("price").isFloat({ gt: 0 })],
  review: [
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional().isString(),
  ],
  cartAdd: [body("productId").notEmpty(), body("quantity").isInt({ min: 1 })],
};

export default function validateMiddleware(schemaName: string) {
  return [
    ...(validationSchemas[schemaName] || []),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }
      next();
    },
  ];
}
