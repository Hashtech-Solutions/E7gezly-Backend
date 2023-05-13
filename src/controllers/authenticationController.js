import passport from "../passport/index.js";
import * as userService from "../services/userService.js";

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

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next({ status: 400, message: err });
    else res.status(200).json({ message: "Logged out successfully" });
  });
};
