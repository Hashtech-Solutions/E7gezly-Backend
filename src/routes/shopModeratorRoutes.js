import express from "express";
import * as shopModeratorController from "../controllers/shopModeratorController.js";
import validateDate from "../middleware/validateDate.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();

router.get("/", shopModeratorController.getShopInfo);

router.put(
  "/update_info",
  validateBody(shopValidation.updateShopInfo),
  shopModeratorController.updateShopInfo
);

router.put("/toggle_status", shopModeratorController.toggleStatus);

router.post(
  "/room",
  validateBody(shopValidation.roomSchema),
  shopModeratorController.addRoom
);

router.put(
  "/room/:room_id",
  validateBody(shopValidation.updateRoom),
  shopModeratorController.updateRoom
);

router.put(
  "/check_in",
  validateBody(shopValidation.checkIn),
  shopModeratorController.checkInRoom
);

router.put(
  "/check_out",
  validateBody(shopValidation.checkOut),
  shopModeratorController.checkOutRoom
);

export default router;
