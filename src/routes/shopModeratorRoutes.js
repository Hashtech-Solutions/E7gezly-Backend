import express from "express";
import * as shopAdminController from "../controllers/shopAdminController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();

router.get("/shop_info", shopAdminController.getShopInfo);

router.put("/toggle_status", shopAdminController.toggleStatus);

router.put(
  "/room/:room_id",
  validateBody(shopValidation.updateRoom),
  shopAdminController.updateRoom
);

router.put(
  "/check_in",
  validateBody(shopValidation.checkIn),
  shopAdminController.checkInRoom
);

router.put(
  "/check_out",
  validateBody(shopValidation.checkOut),
  shopAdminController.checkOutRoom
);

export default router;
