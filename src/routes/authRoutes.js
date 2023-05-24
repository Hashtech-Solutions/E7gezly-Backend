import express from "express";
import * as authController from "../controllers/authenticationController.js";
import validateBody from "../middleware/validateBody.js";
import * as authValidation from "../schemaValidations/authValidation.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *  post:
 *   summary: Login to the application
 *   tags: [Authentication]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Login'
 * /auth/signup:
 *   post:
 *     summary: Signup to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 * /auth/logout:
 *   get:
 *     summary: Logout from the application
 *     tags: [Authentication]
 * /auth/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Authentication]
 * /auth/google/callback:
 *   get:
 *     summary: Google callback
 *     tags: [Authentication]
 */
router.post("/login", validateBody(authValidation.login), authController.login);
router.post("/signup", authController.signup);
router.post("/forgot_password", authController.forgotPassword);
router.post("/reset_password/:token", authController.resetPassword);
router.post("/send_verification_email", authController.sendVerifyEmail);
router.get("/verify_email/:token", authController.verifyEmail);
router.get("/logout", authController.logout);
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);
router.get("/facebook", authController.facebookLogin);
router.get("/facebook/callback", authController.facebookCallback);

export default router;
