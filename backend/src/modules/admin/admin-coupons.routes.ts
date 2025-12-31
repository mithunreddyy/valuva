import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createCouponSchema,
  deleteCouponSchema,
  updateCouponSchema,
} from "./admin-coupons.validation";
import { AdminCouponsController } from "./admin-coupons.controller";

const router = Router();
const controller = new AdminCouponsController();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/", asyncHandler(controller.getAllCoupons));
router.get("/:id", asyncHandler(controller.getCouponById));
router.post(
  "/",
  validate(createCouponSchema),
  asyncHandler(controller.createCoupon)
);
router.patch(
  "/:id",
  validate(updateCouponSchema),
  asyncHandler(controller.updateCoupon)
);
router.delete(
  "/:id",
  validate(deleteCouponSchema),
  asyncHandler(controller.deleteCoupon)
);
router.patch(
  "/:id/toggle",
  asyncHandler(controller.toggleCouponStatus)
);

export default router;

