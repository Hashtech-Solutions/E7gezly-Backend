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
