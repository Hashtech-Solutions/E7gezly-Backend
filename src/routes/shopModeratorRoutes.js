import express from "express";
import * as shopModeratorController from "../controllers/shopModeratorController.js";
import validateDate from "../middleware/validateDate.js";

const router = express.Router();

router.get("/", shopModeratorController.getShopInfo);

router.put("/update_info", shopModeratorController.updateShopInfo);

router.put("/toggle_status", shopModeratorController.toggleStatus);

router.post("/room", shopModeratorController.addRoom);

router.put("/room/:room_id", shopModeratorController.updateRoom);

router.put("/check_in", validateDate, shopModeratorController.checkInRoom);

router.put("/check_out", shopModeratorController.checkOutRoom);

export default router;
