import express from "express";
import auth from "./authRoutes.js";
import shop from "./shopRoutes.js";
import shopModerator from "./shopModeratorRoutes.js";
import passport from "passport";
import fetchShopId from "../middleware/fetchShop.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is working properly");
});

router.use("/auth", auth);
router.use("/admin/shop", passport.authorize("admin"), shop);
router.use(
  "/moderator/shop",
  fetchShopId,
  passport.authorize("shopModerator"),
  shopModerator
);

export default router;
