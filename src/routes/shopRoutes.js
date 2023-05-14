import express from "express";
import * as shopController from "../controllers/shopController.js";
import passport from "passport";

const router = express.Router();

router.post("/", shopController.createShop);
router.get("/", shopController.getManyShops);
router.get("/:id", shopController.getShopById);
router.put("/:id", shopController.updateShopById);
router.delete("/:id", shopController.deleteShopById);

export default router;
