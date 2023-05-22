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
 *         image:
 *           type: string
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
 *         games:
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
 *     UpdateRoom:
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
 *         games:
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
