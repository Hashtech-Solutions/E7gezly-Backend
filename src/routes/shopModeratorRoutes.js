import express from "express";
import * as shopModeratorController from "../controllers/shopModeratorController.js";

const router = express.Router();

router.put("/update_info", shopModeratorController.updateShopInfo);

router.put("/toggle_status", shopModeratorController.toggleStatus);

router.post("/room", shopModeratorController.addRoom);

router.put("/room/:room_id", shopModeratorController.updateRoom);

router.put("/room/:room_id/check_in", shopModeratorController.checkInRoom);

router.put("/room/:room_id/check_out", shopModeratorController.checkOutRoom);

export default router;
