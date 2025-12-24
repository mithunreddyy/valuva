import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { AdminController } from "./admin.controller";

const router = Router();
const controller = new AdminController();

router.post("/login", asyncHandler(controller.login));

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/dashboard", asyncHandler(controller.getDashboard));
router.get("/orders", asyncHandler(controller.getOrders));
router.get("/users", asyncHandler(controller.getUsers));
router.patch(
  "/orders/:orderId/status",
  asyncHandler(controller.updateOrderStatus)
);

export default router;
