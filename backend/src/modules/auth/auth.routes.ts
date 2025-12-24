import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AuthController } from "./auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation";

const router = Router();
const controller = new AuthController();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(controller.register)
);
router.post("/login", validate(loginSchema), asyncHandler(controller.login));
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  asyncHandler(controller.refreshToken)
);
router.post("/logout", authenticate, asyncHandler(controller.logout));
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(controller.forgotPassword)
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler(controller.resetPassword)
);

export default router;
