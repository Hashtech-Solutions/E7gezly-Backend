import express, { application } from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
