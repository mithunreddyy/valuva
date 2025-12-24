import { UserRole } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AdminHomepageController } from "./admin-homepage.controller";
import {
  createSectionSchema,
  updateSectionSchema,
} from "./admin-homepage.validation";

const router = Router();
const controller = new AdminHomepageController();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/homepage/sections", asyncHandler(controller.getAllSections));
router.get("/homepage/sections/:id", asyncHandler(controller.getSectionById));
router.post(
  "/homepage/sections",
  validate(createSectionSchema),
  asyncHandler(controller.createSection)
);
router.put(
  "/homepage/sections/:id",
  validate(updateSectionSchema),
  asyncHandler(controller.updateSection)
);
router.delete("/homepage/sections/:id", asyncHandler(controller.deleteSection));
router.post(
  "/homepage/sections/reorder",
  asyncHandler(controller.reorderSections)
);

export default router;
