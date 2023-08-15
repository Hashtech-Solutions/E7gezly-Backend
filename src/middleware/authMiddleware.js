import {verifyToken} from "../services/firebaseServices.js";
import User from "../models/User.js";

/**
 * Express middleware function to authenticate user based on role
 * @param {String} role - "admin" | "shopAdmin" | "shopModerator" | "customer"
 * @returns {Function} - Express middleware function
 */
const authMiddleware = (role) => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const decodedToken = await verifyToken(token);
    const user = await User.findOne({firebaseUID: decodedToken.uid});
    req.user = user;
    if (!user) {
      return res.status(401).json({message: "Unauthorized"});
    }
    if (req.user.role === "admin") {
      return next();
    }

    if (
      (role === "shopModerator" || role === "shopAdmin") &&
      req.user.shopId != req.shopId
    ) {
      return res.status(401).json({message: "Unauthorized"});
    }

    if (
      req.user.role === "shopAdmin" &&
      (role === "shopModerator" || role === "shopAdmin")
    ) {
      return next();
    }

    if (req.user.role !== role) {
      return res.status(401).json({message: "Unauthorized"});
    }

    next();
  } catch (error) {
    return res.status(401).json({message: "Unauthorized"});
  }
};

export default authMiddleware;
