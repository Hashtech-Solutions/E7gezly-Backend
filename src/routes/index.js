import express from "express";
import auth from "./authRoutes.js";
import shop from "./shopRoutes.js";
import passport from "passport";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is working properly");
});

router.use("/auth", auth);
router.use("/admin/shop", passport.authorize("admin"), shop);

export default router;
