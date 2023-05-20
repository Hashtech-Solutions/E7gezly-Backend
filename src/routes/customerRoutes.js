import express from "express";
import * as customerController from "../controllers/customerController.js";
import validateDate from "../middleware/validateDate.js";

const router = express.Router();

router.get("/shop", customerController.getManyShops);

router.post(
  "/shop/:shop_id/book_room",
  validateDate,
  customerController.bookRoom
);

export default router;
