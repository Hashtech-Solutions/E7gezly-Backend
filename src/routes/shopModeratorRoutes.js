import express from "express";
import * as shopController from "../controllers/shopController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import * as customerValidation from "../schemaValidations/customerValidation.js";
import validateBody from "../middleware/validateBody.js";
import validateDate from "../middleware/validateDate.js";

const router = express.Router();

/**
 * @swagger
 * /shop_moderator/shop_info:
 *   get:
 *     summary: Get moderator's shop info
 *     tags: [ShopModerator]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopResponse'
 * /shop_moderator/add_extra:
 *   post:
 *     summary: Add an extra to a shop
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddExtra'
 *     responses:
 *       200:
 *         description: OK
 * /shop_moderator/remove_extra:
 *   delete:
 *     summary: Remove an extra from a shop
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveExtra'
 * /shop_moderator/update_extra:
 *   put:
 *     summary: Update an extra for a shop
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExtra'
 * /shop_moderator/toggle_status:
 *   put:
 *     summary: Toggle the status of a shop moderator
 *     tags: [ShopModerator]
 *     requestBody:
 *       description: Empty request body
 *       content:
 *         application/json: {}
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request
 *       404:
 *         description: Shop moderator not found
 * /shop_moderator/room/{room_id}:
 *   put:
 *     summary: Update a room by ID for a shop
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the shop
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the room to update
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
 * /shop_moderator/check_in:
 *   put:
 *     summary: Check in a customer to a room
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckIn'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckInResponse'
 * /shop_moderator/check_out:
 *   put:
 *     summary: Check out a customer
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckOut'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckOutResponse'
 * /shop_moderator/book_room:
 *   post:
 *     summary: Book a room
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookRoom'
 * /shop_moderator/reservation/{reservation_id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *         required: true
 * /shop_moderator/room:
 *   get:
 *     summary: Get all rooms for a shop
 *     tags: [ShopModerator]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomResponse'
 */
router.get("/shop_info", shopController.getShopInfo);

router.get("/room", shopController.getShopRooms);

router.put("/toggle_status", shopController.toggleStatus);

router.put(
  "/room/:room_id",
  validateBody(shopValidation.updateRoom),
  shopController.updateRoom
);

router.put(
  "/check_in",
  validateBody(shopValidation.checkIn),
  shopController.checkInRoom
);

router.put(
  "/check_out",
  validateBody(shopValidation.checkOut),
  shopController.checkOutRoom
);

router.post(
  "/book_room",
  validateDate,
  validateBody(customerValidation.bookRoom),
  shopController.bookRoom
);

router.delete(
  "/reservation/:reservation_id",
  shopController.deleteReservationById
);

export default router;
