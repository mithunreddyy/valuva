import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PaymentsController } from "./payments.controller";
import {
  confirmPaymentSchema,
  paymentWebhookSchema,
  initializeRazorpayPaymentSchema,
  verifyRazorpayPaymentSchema,
} from "./payments.validation";

const router = Router();
const controller = new PaymentsController();

// Webhook endpoint (no auth, validated by secret at gateway level in real setups)
router.post(
  "/webhook",
  validate(paymentWebhookSchema),
  asyncHandler(controller.webhook)
);

// Confirm payment for an order (e.g., after client-side gateway success)
router.post(
  "/:orderId/confirm",
  validate(confirmPaymentSchema),
  asyncHandler(controller.confirmPayment)
);

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


