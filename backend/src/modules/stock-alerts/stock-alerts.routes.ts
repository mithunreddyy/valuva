import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { StockAlertsController } from "./stock-alerts.controller";

const router = Router();
const controller = new StockAlertsController();

// Get user's stock alerts
router.get("/", authenticate, asyncHandler(controller.getUserStockAlerts));

// Create stock alert
router.post("/", authenticate, asyncHandler(controller.createStockAlert));

// Delete stock alert
router.delete(
  "/:productId",
  authenticate,
  asyncHandler(controller.deleteStockAlert)
);

export default router;
