import express from "express";
import * as authController from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

export default router;
