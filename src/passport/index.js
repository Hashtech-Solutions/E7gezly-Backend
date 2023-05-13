import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import * as userService from "../services/userService.js";
// import google strategy
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "password",
    },
    async (userName, password, done) => {
      try {
        const user = await userService.getUserByUserName(userName);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userName = profile.emails[0].value.split("@")[0];
        const user = await userService.getUserByUserName(userName);
        if (user) {
          return done(null, user);
        }
        const newUser = {
          userName,
          password: await bcrypt.hash(profile.id, 10),
          role: "customer",
        };
        const createdUser = await userService.createUser(newUser);
        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await userService.getUserById(_id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.authorize = (role) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role === "admin") {
      return next();
    }

    if (req.user.role !== role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "shopModerator" && req.user.shopId !== req.params.shopId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  };
};

export default passport;
