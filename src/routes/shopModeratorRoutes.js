import express from "express";
import * as shopController from "../controllers/shopController.js";
import * as shopValidation from "../schemaValidations/shopValidation.js";
import * as customerValidation from "../schemaValidations/customerValidation.js";
import * as receiptController from "../controllers/receiptController.js";
import validateBody from "../middleware/validateBody.js";
import validateDate, {
  validateGetReceiptByDate,
} from "../middleware/validateDate.js";

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
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Extras'
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Extras'
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Extras'
 * /shop_moderator/extras:
 *   get:
 *     summary: Get all extras for a shop
 *     tags: [ShopModerator]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Extras'
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
 * /shop_moderator/compute_total:
 *   post:
 *     summary: Compute the total price of a reservation
 *     tags: [ShopModerator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComputeTotal'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComputeTotalResponse'
 *
 * /shop_moderator/receipt:
 *   get:
 *     summary: Get all receipts for a shop or receipts in a date range if start_date and end_date are provided or invalid date format
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: Start date of the date range
 *         required: false
 *         example: 2021-01-01
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: End date of the date range
 *         required: false
 *         example: 2021-01-01
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ReceiptResponse'
 * /shop_moderator/receipt/{room_id}:
 *   get:
 *     summary: Get all receipts for a room or receipts in a date range if start_date and end_date are provided or invalid date format
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: string
 *         description: ID of the room
 *         required: true
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: Start date of the date range
 *         required: false
 *         example: 2021-01-01
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: End date of the date range
 *         required: false
 *         example: 2021-01-01
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ReceiptResponse'
 *
 * /shop_moderator/receipt_total:
 *   get:
 *     summary: Get total revenue for a shop for all time or in a date range if start_date and end_date are provided or invalid date format
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: Start date of the date range
 *         required: false
 *         example: 2021-01-01
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: End date of the date range
 *         required: false
 *         example: 2021-01-01
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: number
 * /shop_moderator/receipt_total/{room_id}:
 *   get:
 *     summary: Get total revenue for a room for all time or in a date range if start_date and end_date are provided or invalid date format
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: string
 *         description: ID of the room
 *         required: true
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: Start date of the date range
 *         required: false
 *         example: 2021-01-01
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: yyyy-mm-dd
 *         description: End date of the date range
 *         required: false
 *         example: 2021-01-01
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: number
 * /shop_moderator/{reservation_id}/confirm:
 *   put:
 *     summary: Confirm a reservation by ID
 *     tags: [ShopModerator]
 *     responses:
 *       200:
 *         description: OK
 * /shop_moderator/game/find_game:
 *   get:
 *     summary: Find a game by name
 *     tags: [ShopModerator]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/shop_info", shopController.getShopInfo);

router.get("/extras", shopController.getShopExtras);

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

router.put(
  "/reservation/:reservation_id/confirm",
  shopController.confirmReservationById
);

router.post(
  "/add_extra",
  validateBody(shopValidation.addExtra),
  shopController.addExtra
);

router.delete(
  "/remove_extra",
  validateBody(shopValidation.removeExtra),
  shopController.removeExtra
);

router.put(
  "/update_extra",
  validateBody(shopValidation.updateExtra),
  shopController.updateExtra
);

router.post(
  "/compute_total",
  validateBody(shopValidation.computeTotal),
  shopController.computeSessionTotal
);

router.get(
  "/receipt/:room_id",
  validateGetReceiptByDate,
  receiptController.getReceiptsByRoomId
);

router.get("/game/find_game", shopController.findGame);

router.get(
  "/receipt",
  validateGetReceiptByDate,
  receiptController.getReceiptsByShopId
);

router.get(
  "/receipt_total/:room_id",
  validateGetReceiptByDate,
  receiptController.getRoomTotal
);

router.get(
  "/receipt_total",
  validateGetReceiptByDate,
  receiptController.getShopTotal
);

export default router;
