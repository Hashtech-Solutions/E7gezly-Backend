import * as shopService from "../services/shopService.js";
import * as reservationService from "../services/reservationService.js";
import * as userService from "../services/userService.js";
import * as firebaseService from "../services/firebaseServices.js";
export const getManyShops = async (req, res, next) => {
  try {
    const query = req.query;
    if (query.availableActivities) {
      query.availableActivities = {$in: query.availableActivities};
    }
    if (query.name) {
      query.name = {$regex: query.name, $options: "i"};
    }
    const shops = await shopService.getManyShops(
      req.query,
      "name numVacancies availableActivities"
    );
    res.status(200).json(shops);
  } catch (error) {
    return next({status: 400, message: error});
  }
};

export const bookRoom = async (req, res, next) => {
  try {
    let {roomId, startTime, endTime} = req.body;
    const userId = req.user._id;
    const shopId = req.params.shop_id;
    const reservation = await reservationService.createReservation({
      startTime,
      endTime,
      userId,
      shopId,
      roomId,
      confirmed: false,
    });
    res.status(200).json(reservation);
  } catch (error) {
    return next({status: 400, message: error}, req, res, next);
  }
};

export const getShopById = async (req, res, next) => {
  try {
    const shopId = req.params.shop_id;
    const shop = await shopService.getShopById(shopId);
    res.status(200).json(shop);
  } catch (error) {
    return next({status: 400, message: error});
  }
};

export const getCustomerReservations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reservations = await reservationService.getManyReservations({
      userId,
      confirmed: true,
    });
    res.status(200).json(reservations);
  } catch (error) {
    return next({status: 400, message: error});
  }
};

export const getCustomerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userService.getUserById(userId);
    res.status(200).json({email: user.email});
  } catch (error) {
    res.status(400).json({message: error});
    return next({status: 400, message: error}, req, res, next);
  }
};

/**
 * Update customer profile information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response indicating success or error
 */
export const updateCustomerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    var user = await userService.getUserById(userId);
    const email = req.body;
    await firebaseService.changeUserEmail(user.firebaseUID, email);
    var oldEmail = user.email;
    if (email) {
      const user = await userService.getUserByEmail(email);
      if (user) {
        return next(
          {status: 400, message: "email already exists"},
          req,
          res,
          next
        );
      }
    }
    user.email = email || user.email;
    await userService.updateUser(userId, user);
    res.status(200).json(user);
  } catch (error) {
    if (!/auth\/.*/.test(error.code)) {
      // check if error is related to firebase
      await firebaseService.changeUserEmail(user.firebaseUID, oldEmail); // revert email change if error is not related to firebase to avoid inconsistency
    }
    return next({status: 400, message: error}, req, res, next);
  }
};

/**
 * Add FCM token to user's account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response indicating success or error
 */
export const addFCMToken = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {fcmToken} = req.body;
    if (!fcmToken) return next({status: 400, message: "Token not found"});
    await userService.addFCMToken(userId, fcmToken);
    res.status(200).json({message: "Token added successfully"});
  } catch (error) {
    return next({status: 400, message: error}, req, res, next);
  }
};
