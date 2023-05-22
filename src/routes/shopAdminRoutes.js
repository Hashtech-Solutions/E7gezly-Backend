import express from "express";
import * as shopAdminController from "../controllers/shopAdminController.js";
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
  uploadImage,
  uploadMiddleware,
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
