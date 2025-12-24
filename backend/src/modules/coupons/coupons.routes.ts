import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { CouponsController } from "./coupons.controller";
import { listCouponsSchema, validateCouponSchema } from "./coupons.validation";

const router = Router();
const controller = new CouponsController();

// Authenticated users can validate and list coupons
router.use(authenticate);

router.get(
  "/",
  validate(listCouponsSchema),
  asyncHandler(controller.listActiveCoupons)
);

router.get(
  "/validate/:code",
  validate(validateCouponSchema),
  asyncHandler(controller.validateCoupon)
);

export default router;
