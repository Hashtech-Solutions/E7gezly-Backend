import passport from "../passport/index.js";
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mail.js";
import bcrypt from "bcrypt";

const PEPPER = process.env.PEPPER
const SECRET = process.env.SECRET
const ROUNDS = Number(process.env.ROUNDS)

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
    const password = await bcrypt.hash(req.body.password + PEPPER, ROUNDS);
    const emailRegex = /^\S+@\S+\.\S+$/;
    const match = req.body.identifier.match(emailRegex);
    if (match) {
      // user is signing up with email
      const userName = req.body.identifier.split("@")[0];
      await userService.createUser({
        userName,
        email: req.body.identifier,
        role: "customer",
        password,
      });
      sendVerifyEmail(req, res, next);
    } else {
      return next({
        status: 400,
        message: "identifier must be an email",
      });
      // user is signing up with username
      // to limit username for onlyshops pass a token from the admin with body and check here
      // if token is valid then create user with shopId
      // I guess shop owners will be created by admin and not just register by themselves
      const user = await userService.createUser({
        userName: req.body.identifier,
        role: "customer",
        password,
      });
      return res.status(200).json(user);
    }
    // req.logIn(user, (err) => {
    //   if (err) return next({ status: 400, message: err });
    //   return res.status(200).json(user);
    // });
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const sendVerifyEmail = async (req, res, next) => {
  const email = req.body.email|| req.body.identifier;
  if (!email) {
    return next({
      status: 400,
      message: "email is required",
    });
  }
  try {
    // check if user exists in db
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return next({
        status: 400,
        message: "user not found",
      });
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        SECRET + 'false',
        { expiresIn: "5h" }
      );
      const url = `${process.env.DOMAIN}/api/auth/verify_email/${token}`;
      console.log(url);
      sendEmail(
        email,
        "Verify email",
        "You have requested to verify your email",
        "A unique link to verify your email has been generated for you. To verify your email, click the following link and follow the instructions.",
        url,
        "Verify Email"
      );
      return res.json({ message: "Verify link sent", url: token });
    }
  } catch (err) {
    return next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next({
      status: 400,
      message: "token is required",
    });
  }
  try {
    const decoded = jwt.verify(token, SECRET + 'false');
    const user = await userService.getUserById(decoded.id);
    if (!user) {
      return next({
        status: 400,
        message: "user not found",
      });
    } else {
      user.verified = true;
      await user.save();
      res.json({ message: "email verified" });
    }
  } catch (err) {
    return next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next({
      status: 400,
      message: "email is required",
    });
  }
  try {
    // check if user exists in db
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return next({
        status: 400,
        message: "user not found",
      });
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        SECRET + user.password,
        { expiresIn: "15m" }
      );
      const url = `${process.env.DOMAIN}/api/auth/reset_password/${token}`;
      console.log(url);
      sendEmail(
        email,
        "Reset password",
        "You have requested to reset your password",
        "A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.",
        url,
        "Reset Password"
      );
      res.json({ message: "Reset link sent", url: token });
    }
  } catch (err) {
    return next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, passwordConfirmation } = req.body;
  if (password !== passwordConfirmation) {
    return next({
      status: 401,
      message: "password and confirm password must match",
    });
  }
  if (!token || !password || !passwordConfirmation) {
    return next({
      status: 401,
      message: "token is required",
    });
  }
  try {
    const obj = jwt.decode(token);
    if (!obj) {
      return next({
        status: 498,
        message: "Invalid token",
      });
    }
    const user = await userService.getUserByEmail(obj.email)
    if (!user) {
      return next({
        status: 498,
        message: "Invalid token",
      });
    }
    jwt.verify(token, SECRET + user.password, async (err, decoded) => {
      if (err) {
        return next({
          status: 498,
          message: "Invalid token",
        });
      }
      const pass = await bcrypt.hash(password + PEPPER, ROUNDS);
      console.log('pass', pass);
      user.password = pass;
      await userService.updateUser(user.id, user)
      return res.status(200).json({ message: "Password updated" });
    });
  } catch (err) {
    next(err);
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

export const facebookLogin = (req, res, next) => {
  console.log("facebook login");
  passport.authenticate(
    'facebook',
    { scope : ['email'] },
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

export const facebookCallback = (req, res, next) => {
  console.log("facebook callback");
  passport.authenticate('facebook', {
    successRedirect: "/",
    failureRedirect: "/login",
  }) (req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next({ status: 400, message: err });
    else res.status(200).json({ message: "Logged out successfully" });
  });
};
