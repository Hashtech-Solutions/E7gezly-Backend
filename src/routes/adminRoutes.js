import express from "express";
import * as adminController from "../controllers/adminController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();

router.post(
  "/",
  validateBody(shopValidation.shopSchema),
  adminController.createShop
);
router.get("/", adminController.getManyShops);
router.get("/:id", adminController.getShopById);
router.put("/:id", adminController.updateShopById);
router.delete("/:id", adminController.deleteShopById);

export default router;
