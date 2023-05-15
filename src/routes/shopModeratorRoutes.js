import express from "express";
import * as shopModeratorController from "../controllers/shopModeratorController.js";

const router = express.Router();

router.put("/updateShopInfo", shopModeratorController.updateShopInfo);

router.post("/room", shopModeratorController.addRoom);

// router.put("/:id/room/:roomId", shopModeratorController.updateRoom);

export default router;
