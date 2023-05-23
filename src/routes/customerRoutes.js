import express from "express";
import * as customerController from "../controllers/customerController.js";
import validateDate from "../middleware/validateDate.js";
import * as customerValidation from "../schemaValidations/customerValidation.js";
import validateBody from "../middleware/validateBody.js";

const router = express.Router();

/**
 * @swagger
 * /customer/shop/{shop_id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Customer]
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
 *               $ref: '#/components/schemas/ShopResponse'
 * /customer/shop:
 *   get:
 *     summary: Retrieve multiple shops
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Shop'
 * /customer/shop/{shop_id}/book_room:
 *   post:
 *     summary: Book a room in a shop
 *     tags: [Customer]
 *     parameters:
 *       - name: shop_id
 *         in: path
 *         description: ID of the shop
 *         required: true
 *         type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookRoom'
 *     responses:
 *       200:
 *         description: Successful operation
 * customer/reservation:
 *   get:
 *     summary: Retrieve customer reservations
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reservation'
 */
router.get("/shop", customerController.getManyShops);

router.get("/shop/:shop_id", customerController.getShopById);

router.post(
  "/shop/:shop_id/book_room",
  validateDate,
  validateBody(customerValidation.bookRoom),
  customerController.bookRoom
);

router.get("/reservation", customerController.getCustomerReservations);

export default router;
