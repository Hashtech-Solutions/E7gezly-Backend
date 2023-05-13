import express from "express";
import auth from "./auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is working properly");
});

router.use("/auth", auth);

export default router;
