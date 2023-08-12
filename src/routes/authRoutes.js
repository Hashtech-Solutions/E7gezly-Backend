import express from "express";
import * as authController from "../controllers/authenticationController.js";

const router = express.Router();

/**
 * @swagger
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
 */
router.post("/signup", authController.signup);

export default router;
