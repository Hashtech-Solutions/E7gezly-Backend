import express from "express";
import auth from "./authRoutes.js";
import shop from "./adminRoutes.js";
import shopAdmin from "./shopAdminRoutes.js";
import shopModerator from "./shopModeratorRoutes.js";
import passport from "passport";
import fetchShopId from "../middleware/fetchShop.js";
import customer from "./customerRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is working properly");
});

router.use("/auth", auth);

router.use("/admin/shop", passport.authorize("admin"), shop);
router.use(
  "/shop_admin",
  fetchShopId,
  passport.authorize("shopModerator"),
  shopAdmin
);
router.use(
  "/shop_moderator",
  fetchShopId,
  passport.authorize("shopModerator"),
  shopModerator
);
router.use("/customer", passport.authorize("customer"), customer);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Shop:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         userName:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             long:
 *               type: number
 *             lat:
 *               type: number
 *         password:
 *           type: string
 *     ReservationResponse:
 *       type: object
 *       properties:
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         roomId:
 *           type: string
 *         userId:
 *           type: string
 *         shopId:
 *           type: string
 *     RoomResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         roomType:
 *           type: string
 *         reservations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReservationResponse'
 *         name:
 *           type: string
 *           description: The name of the room.
 *         status:
 *           type: string
 *           enum:
 *             - 'occupied'
 *             - 'available'
 *           description: The current status of the room.
 *         hourlyRate:
 *           type: number
 *           description: The hourly rate for the room (optional).
 *         capacity:
 *           type: number
 *           description: The capacity of the room (optional).
 *         availableServices:
 *           type: array
 *           items:
 *             type: string
 *           description: List of available services in the room.
 *     ShopModerator:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *         password:
 *           type: string
 *           minLength: 8
 *     UpdateShopInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             long:
 *               type: number
 *             lat:
 *               type: number
 *         baseHourlyRate:
 *           type: number
 *         availableGames:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *         availableServices:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - service1
 *               - service2
 *         availableActivities:
 *           type: array
 *           items:
 *             type: string
 *         extras:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     ComputeTotal:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *         extras:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     ComputeTotalResponse:
 *       type: object
 *       properties:
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         timeTotal:
 *           type: number
 *         extrasTotal:
 *           type: number
 *         roomTotal:
 *           type: number
 *     AddExtra:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *     UpdateExtra:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        price:
 *          type: number
 *     RemoveExtra:
 *       type: object
 *       properties:
 *         name:
 *          type: string
 *     Extras:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           price:
 *             type: number
 *     Room:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         roomType:
 *           type: string
 *           enum:
 *             - roomType1
 *             - roomType2
 *         hourlyRate:
 *           type: number
 *         capacity:
 *           type: number
 *         availableGames:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *         availableServices:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - service1
 *               - service2
 *     CheckIn:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *     CheckOut:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *     CheckInResponse:
 *       type: object
 *       properties:
 *         numVacancies:
 *           type: number
 *         session:
 *           type: object
 *           properties:
 *             roomId:
 *               type: string
 *             startTime:
 *               type: string
 *             endTime:
 *              type: string
 *             userId:
 *               type: string
 *     CheckOutResponse:
 *       type: object
 *       properties:
 *         numVacancies:
 *           type: number
 *         roomId:
 *           type: string
 *     ShopResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the shop.
 *           unique: true
 *           required: true
 *         image:
 *           type: string
 *           description: The image of the shop.
 *           required: false
 *         isOpen:
 *           type: boolean
 *           description: Indicates if the shop is open or closed.
 *           required: true
 *         location:
 *           $ref: '#/components/schemas/Location'
 *           description: The coordinates of the shop's location.
 *           required: false
 *         baseHourlyRate:
 *           type: number
 *           description: The base hourly rate of the shop.
 *         shopAdminId:
 *           type: string
 *           description: The ID of the shop's administrator.
 *           required: true
 *         shopModerators:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the shop moderator.
 *                 required: true
 *               userName:
 *                 type: string
 *                 description: The username of the shop moderator.
 *                 required: true
 *           description: List of shop moderators.
 *         availableGames:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Game'
 *           description: List of available games in the shop.
 *         availableServices:
 *           type: array
 *           items:
 *             type: string
 *           description: List of available services in the shop.
 *         rooms:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoomResponse'
 *           description: List of rooms in the shop.
 *         sessions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: The ID of the room for the session.
 *                 required: true
 *               roomName:
 *                 type: string
 *                 description: The name of the room for the session.
 *                 required: true
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the session.
 *                 required: true
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: The end time of the session.
 *                 required: false
 *               userId:
 *                 type: string
 *                 description: The ID of the user for the session.
 *                 required: false
 *           description: List of sessions in the shop.
 *         numVacancies:
 *           type: number
 *           description: The number of vacancies in the shop.
 *         extras:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the extra.
 *                 required: true
 *               price:
 *                 type: number
 *                 description: The price of the extra.
 *                 required: true
 *           description: List of extras in the shop.
 *         availableActivities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of available activities in the shop.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Signup:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *         password:
 *           type: string
 *     Login:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookRoom:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 */
