import express from "express";
import * as adminController from "../controllers/adminController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();
/**
 * @swagger
 * /admin/shop:
 *   post:
 *     summary: Create a new shop
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 * /admin/shop/{shop_id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the shop to retrieve
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 * admin/shop/{shopId}:
 *   put:
 *     summary: Update a shop by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the shop to update
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
 *               $ref: '#/components/schemas/Admin'
 */
router.post(
  "/",
  validateBody(shopValidation.shopSchema),
  adminController.createShop
);
/**
 * @swagger
 * /admin/shop:
 *   get:
 *     summary: Retrieve multiple shops
 *     tags: [Admin]
 */
router.get("/", adminController.getManyShops);
router.get("/:id", adminController.getShopById);
router.put("/:id", adminController.updateShopById);
router.delete("/:id", adminController.deleteShopById);

export default router;
