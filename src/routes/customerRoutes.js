import express from "express";
import * as customerController from "../controllers/customerController.js";

const router = express.Router();

router.get("/shop", customerController.getManyShops);

export default router;
