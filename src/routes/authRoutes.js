import express from "express";
import * as authController from "../controllers/authenticationController.js";
import validateBody from "../middleware/validateBody.js";
import * as authValidation from "../schemaValidations/authValidation.js";

const router = express.Router();

router.post("/login", validateBody(authValidation.login), authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

export default router;
