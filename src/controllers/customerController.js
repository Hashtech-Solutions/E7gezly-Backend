import * as shopService from "../services/shopService.js";
import * as reservationService from "../services/reservationService.js";

export const getManyShops = async (req, res, next) => {
  try {
    const query = req.query;
    if (query.availableActivities) {
      query.availableActivities = { $in: query.availableActivities };
    }
    if (query.name) {
      query.name = { $regex: query.name, $options: "i" };
    }
    const shops = await shopService.getManyShops(
      req.query,
      "name numVacancies availableActivities"
    );
    res.status(200).json(shops);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const bookRoom = async (req, res, next) => {
  try {
    let { roomId, startTime, endTime } = req.body;
    const userId = req.user._id;
    const shopId = req.params.shop_id;
    const reservation = await reservationService.createReservation({
      startTime,
      endTime,
      userId,
      shopId,
      roomId,
    });
    res.status(200).json(reservation);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const getShopById = async (req, res, next) => {
  try {
    const shop = await shopService.getShopById(req.params.id);
    res.status(200).json(shop);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const getCustomerReservations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reservations = await reservationService.getManyReservations({
      userId,
    });
    res.status(200).json(reservations);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};
