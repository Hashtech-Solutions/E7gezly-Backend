import express from "express";
import * as shopController from "../controllers/shopController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import validateBody from "../middleware/validateBody.js";
import { uploadImage, uploadMiddleware } from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * shop_admin/update_info:
 *   put:
 *     summary: Update admin's shop info
 *     tags: [ShopAdmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShopInfo'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 * shop_admin/room:
 *   post:
 *     summary: Create a new room for shop
 *     tags: [ShopAdmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
router.put(
  "/update_info",
  validateBody(shopValidation.updateShopInfo),
  shopController.updateShopInfo
);

router.post(
  "/moderator",
  validateBody(shopValidation.shopModeratorSchema),
  shopController.createShopModerator
);

router.delete(
  "/moderator/:shop_moderator_id",
  shopController.removeShopModerator
);

router.post(
  "/room",
  validateBody(shopValidation.roomSchema),
  shopController.addRoom
);

export default router;
