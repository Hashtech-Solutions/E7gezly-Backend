// import passport from "../passport/index.js";
import {verifyToken} from "../services/firebaseServices.js";
import * as userService from "../services/userService.js";

/**
 * Creates a new user account and returns the user object.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The user object.
 * @throws {Object} The error object.
 */
export const signup = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next({status: 400, message: "Token not found"});
    const decodedToken = await verifyToken(token);
    const firebaseUID = decodedToken.uid;
    const user = await userService.createUser({
      firebaseUID,
      email: req.body.email,
      role: "customer",
      fcmTokens: req.body.fcmToken ? [req.body.fcmToken] : [],
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return next({status: 400, message: error});
  }
};
