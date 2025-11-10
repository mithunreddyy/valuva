// File: src/routes/auth.routes.ts
import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
router.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);
router.get(
  "/verify-email/:token",
  authController.verifyEmail.bind(authController)
);

export default router;
