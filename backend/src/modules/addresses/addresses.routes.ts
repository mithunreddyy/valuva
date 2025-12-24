import { Router } from "express";
import { asyncHandler } from "../../middleware/async.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { AddressesController } from "./addresses.controller";
import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from "./addresses.validation";

const router = Router();
const controller = new AddressesController();

router.use(authenticate);

router.get("/", asyncHandler(controller.getUserAddresses));
router.get("/:id", asyncHandler(controller.getAddressById));
router.post(
  "/",
  validate(createAddressSchema),
  asyncHandler(controller.createAddress)
);
router.put(
  "/:id",
  validate(updateAddressSchema),
  asyncHandler(controller.updateAddress)
);
router.delete(
  "/:id",
  validate(deleteAddressSchema),
  asyncHandler(controller.deleteAddress)
);

export default router;
