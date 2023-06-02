import session from "express-session";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config();

export default session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // should be changed in production
  cookie: {
    secure: process.env.NODE_ENV === "local" ? false : true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: process.env.NODE_ENV === "local" ? false : true,
    sameSite: process.env.NODE_ENV === "local" ? false : "none",
    // sameSite: "none",
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "auth-sessions",
  }),
});
