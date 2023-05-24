import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import * as userService from "../services/userService.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
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
        console.log("user", user);
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
      callbackURL: `${process.env.DOMAIN}api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Gprofile", profile);
        const userName = profile.emails[0].value.split("@")[0];
        const user = await userService.getUserByUserName(userName);
        if (user) {
          return done(null, user);
        }
        const newUser = {
          userName,
          password: await bcrypt.hash(profile.id, 10),
          email: profile.emails[0].value,
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `http://localhost:3000/api/auth/facebook/callback/`,
      profileFields:['email', 'name','displayName','photos']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log('fprofile',profile);
        const userName = profile.emails[0].value.split("@")[0];
        const user = await userService.getUserByUserName(userName);
        if (user) {
          return done(null, user);
        }
        const newUser = {
          userName,
          password: await bcrypt.hash(profile.id, 10),
          email: profile.emails[0].value,
          role: "customer",
        }
        const createUser = await userService.createUser(newUser);
        return done(null, createUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  console.log("serialized");
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    console.log("deserialized");
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

    if (
      (role === "shopModerator" || role === "shopAdmin") &&
      req.user.shopId != req.shopId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      req.user.role === "shopAdmin" &&
      (role === "shopModerator" || role === "shopAdmin")
    ) {
      return next();
    }

    if (req.user.role !== role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  };
};

export default passport;
