import express, { application } from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/index.js";
import session from "express-session";
import passport from "passport";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

connectDB();
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", router);

app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
