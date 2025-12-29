import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { SupportController } from "./support.controller";

const router = Router();
const controller = new SupportController();

// User routes
router.post("/", authenticate, asyncHandler(controller.createTicket));
router.get("/", authenticate, asyncHandler(controller.getUserTickets));
router.get("/:id", authenticate, asyncHandler(controller.getTicketById));
router.post("/:id/reply", authenticate, asyncHandler(controller.addReply));

// Admin routes
router.get(
  "/all",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllTickets)
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(controller.updateTicketStatus)
);

export default router;
