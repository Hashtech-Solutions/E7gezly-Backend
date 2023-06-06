import * as shopService from "../services/shopService.js";
import * as reservationService from "../services/reservationService.js";
import bcrypt from "bcrypt";

export const getShopInfo = async (req, res, next) => {
  try {
    const shop = await shopService.getShopById(req.shopId);
    res.status(200).json(shop);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const getShopRooms = async (req, res, next) => {
  try {
    const shop = await shopService.getShopById(req.shopId);
    res.status(200).json(shop.rooms);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const updateShopInfo = async (req, res, next) => {
  try {
    const updatedShop = await shopService.updateShopById(req.shopId, req.body);
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const addExtra = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const extras = await shopService.addExtra(shopId, req.body);
    res.status(200).json(extras);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const removeExtra = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const extraName = req.params.extra_name;
    const extras = await shopService.removeExtra(shopId, extraName);
    res.status(200).json(extras);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const updateExtra = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const extra = req.body;
    const extras = await shopService.updateExtra(shopId, extra);
    res.status(200).json(extras);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const createShopModerator = async (req, res, next) => {
  try {
    let { password } = req.body;
    password = await bcrypt.hash(password, 10);
    const shopModerator = await shopService.createShopModerator({
      ...req.body,
      password,
      role: "shopModerator",
      shopId: req.shopId,
    });
    res.status(200).json(shopModerator);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const removeShopModerator = async (req, res, next) => {
  try {
    const shopModeratorId = req.params.shop_moderator_id;
    const shopModerator = await shopService.removeShopModerator(
      shopModeratorId
    );
    res.status(200).json(shopModerator);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const addRoom = async (req, res, next) => {
  try {
    const room = await shopService.addRoom(req.shopId, {
      ...req.body,
      status: "available",
    });
    res.status(200).json(room);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const roomId = req.params.room_id;
    const updatedShop = await shopService.updateShopById(
      req.shopId,
      {
        // set room to req.body
        "rooms.$[elem]": {
          ...req.body,
          _id: roomId,
        },
      },
      { arrayFilters: [{ "elem._id": roomId }], new: true }
    );
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const toggleStatus = async (req, res, next) => {
  try {
    const { isOpen } = req.body;
    const updatedShop = await shopService.updateShopById(req.shopId, [
      { $set: { isOpen } },
    ]);
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const checkInRoom = async (req, res, next) => {
  try {
    const { roomId, userId } = req.body;
    const { shopId } = req;
    const session = await shopService.checkInRoom(shopId, roomId, userId);
    res.status(200).json(session);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const checkOutRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const { shopId } = req;
    const session = await shopService.checkOutRoom(shopId, roomId);
    res.status(200).json(session);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const bookRoom = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const { roomId, startTime, endTime } = req.body;
    const reservation = await reservationService.createReservation({
      shopId,
      roomId,
      startTime,
      endTime,
    });
    res.status(200).json(reservation);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const deleteReservationById = async (req, res, next) => {
  try {
    const reservationId = req.params.reservation_id;
    const reservation = await reservationService.deleteReservationById(
      reservationId
    );
    res.status(200).json(reservation);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};
