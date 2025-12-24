import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { OrdersController } from "./orders.controller";
import { createOrderSchema, getOrderSchema } from "./orders.validation";

const router = Router();
const controller = new OrdersController();

router.use(authenticate);

router.post(
  "/checkout",
  validate(createOrderSchema),
  asyncHandler(controller.createOrder)
);
router.get("/", asyncHandler(controller.getUserOrders));
router.get(
  "/:id",
  validate(getOrderSchema),
  asyncHandler(controller.getOrderById)
);

export default router;
