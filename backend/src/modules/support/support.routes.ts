import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { asyncHandler } from "../../middleware/async.middleware";
import { SupportController } from "./support.controller";

const router = Router();
const controller = new SupportController();

// User routes
router.post("/", authMiddleware, asyncHandler(controller.createTicket));
router.get("/", authMiddleware, asyncHandler(controller.getUserTickets));
router.get("/:id", authMiddleware, asyncHandler(controller.getTicketById));
router.post("/:id/reply", authMiddleware, asyncHandler(controller.addReply));

// Admin routes
router.get(
  "/all",
  authMiddleware,
  rbacMiddleware(["ADMIN", "SUPER_ADMIN"]),
  asyncHandler(controller.getAllTickets)
);
router.patch(
  "/:id/status",
  authMiddleware,
  rbacMiddleware(["ADMIN", "SUPER_ADMIN"]),
  asyncHandler(controller.updateTicketStatus)
);

export default router;

