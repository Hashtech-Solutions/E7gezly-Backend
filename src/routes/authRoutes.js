import express from "express";
import * as authController from "../controllers/authenticationController.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     description: Login to the application using firebase token put it in the header as authorization
 *     tags: [Authentication]
 *
 * /auth/signup:
 *   post:
 *     summary: Signup to the application
 *     description: Signup to the application using firebase token put it in the header as authorization
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 */
router.post("/login", authController.login);

router.post("/signup", authController.signup);

export default router;
