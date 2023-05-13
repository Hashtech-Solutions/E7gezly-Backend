import passport from "../passport/index.js";
import * as userService from "../services/userService.js";
import bcrypt from "bcrypt";

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return next({ status: 400, message: info.message });
    req.logIn(user, (err) => {
      if (err) return next({ status: 400, message: err });
      return res.status(200).json(user);
    });
  })(req, res, next);
};

export const signup = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await userService.createUser({
      ...req.body,
      role: "customer",
      password,
    });
    req.logIn(user, (err) => {
      if (err) return next({ status: 400, message: err });
      return res.status(200).json(user);
    });
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const googleLogin = (req, res, next) => {
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return next({ status: 400, message: info.message });
      req.logIn(user, (err) => {
        if (err) return next({ status: 400, message: err });
        return res.status(200).json(user);
      });
    }
  )(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next({ status: 400, message: err });
    else res.status(200).json({ message: "Logged out successfully" });
  });
};
