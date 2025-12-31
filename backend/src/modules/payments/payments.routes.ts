import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PaymentsController } from "./payments.controller";
import {
  initializeRazorpayPaymentSchema,
  verifyRazorpayPaymentSchema,
} from "./payments.validation";

const router = Router();
const controller = new PaymentsController();

// Razorpay endpoints
router.post(
  "/razorpay/:orderId/initialize",
  authenticate,
  validate(initializeRazorpayPaymentSchema),
  asyncHandler(controller.initializeRazorpayPayment)
);

router.post(
  "/razorpay/:orderId/verify",
  authenticate,
  validate(verifyRazorpayPaymentSchema),
  asyncHandler(controller.verifyRazorpayPayment)
);

// Razorpay webhook (no auth, validated by signature)
router.post(
  "/razorpay/webhook",
  asyncHandler(controller.razorpayWebhook)
);

export default router;


