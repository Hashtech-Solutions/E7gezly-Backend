import express from "express";
import * as shopAdminController from "../controllers/shopAdminController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();

router.put(
  "/update_info",
  validateBody(shopValidation.updateShopInfo),
  shopAdminController.updateShopInfo
);

router.post(
  "/moderator",
  validateBody(shopValidation.shopModeratorSchema),
  shopAdminController.createShopModerator
);

router.delete(
  "/moderator/:shop_moderator_id",
  shopAdminController.removeShopModerator
);

router.post(
  "/room",
  validateBody(shopValidation.roomSchema),
  shopAdminController.addRoom
);

export default router;
