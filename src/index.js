import express, { application } from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/index.js";
import session from "express-session";
import passport from "passport";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // should be changed in production
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "none",
    },
  })
);

connectDB();
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log(req.isAuthenticated());
  res.send("Hello World");
});

app.use("/api", router);

app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
