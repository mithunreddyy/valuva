import { UserRole } from "@prisma/client";
import { Router } from "express";
import { AdminBulkController } from "./admin-bulk.controller";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";

const router = Router();
const controller = new AdminBulkController();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.post(
  "/products/status",
  asyncHandler(controller.bulkUpdateProductStatus as any)
);

router.post(
  "/products/delete",
  asyncHandler(controller.bulkDeleteProducts as any)
);

router.post(
  "/orders/status",
  asyncHandler(controller.bulkUpdateOrderStatus as any)
);

router.post(
  "/export/:entityType",
  asyncHandler(controller.bulkExportData as any)
);

export default router;

