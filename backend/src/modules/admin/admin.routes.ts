import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AdminMFAController } from "./admin-mfa.controller";
import {
  disableMFASchema,
  regenerateBackupCodesSchema,
  verifyAndEnableMFASchema,
} from "./admin-mfa.validation";
import { AdminController } from "./admin.controller";

const router = Router();
const controller = new AdminController();
const mfaController = new AdminMFAController();

router.post("/login", asyncHandler(controller.login));

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

// MFA routes
router.post("/mfa/setup", asyncHandler(mfaController.setupMFA));
router.post(
  "/mfa/verify",
  validate(verifyAndEnableMFASchema),
  asyncHandler(mfaController.verifyAndEnableMFA)
);
router.post(
  "/mfa/disable",
  validate(disableMFASchema),
  asyncHandler(mfaController.disableMFA)
);
router.post(
  "/mfa/backup-codes",
  validate(regenerateBackupCodesSchema),
  asyncHandler(mfaController.regenerateBackupCodes)
);

router.get("/dashboard", asyncHandler(controller.getDashboard));
router.get("/orders", asyncHandler(controller.getOrders));
router.get("/orders/:id", asyncHandler(controller.getOrderById));
router.get("/users", asyncHandler(controller.getUsers));
router.patch(
  "/orders/:orderId/status",
  asyncHandler(controller.updateOrderStatus)
);

export default router;
