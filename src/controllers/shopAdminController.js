import { set } from "mongoose";
import * as shopService from "../services/shopService.js";
import * as reservationService from "../services/reservationService.js";
import bcrypt from "bcrypt";

const setNumVacancies = {
  $size: {
    $filter: {
      input: "$rooms",
      as: "room",
      cond: {
        $eq: ["$$room.status", "available"],
      },
    },
  },
};

const setRoomStatus = (roomId, status) => ({
  $map: {
    input: "$rooms",
    as: "room",
    in: {
      $cond: {
        if: { $eq: ["$$room._id", roomId] },
        then: {
          $mergeObjects: [
            "$$room",
            {
              status: status,
            },
          ],
        },
        else: "$$room",
      },
    },
  },
});

export const getShopInfo = async (req, res, next) => {
  try {
    const shop = await shopService.getShopById(req.shopId);
    res.status(200).json(shop);
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
    const { roomId } = req.body;
    const shop = await shopService.getShopById(req.shopId);
    const session = shopService.getSessionByRoomId(shop, roomId);
    if (session) {
      return next(
        {
          status: 400,
          message: "Room is already occupied",
        },
        req,
        res,
        next
      );
    }
    const updatedShop = await shopService.updateShopById(req.shopId, [
      {
        $set: {
          sessions: [
            ...shop.sessions,
            {
              roomId,
              roomName: shop.rooms.find((room) => `${room._id}` === `${roomId}`)
                .name,
              startTime: new Date(),
            },
          ],
        },
      },
      {
        $set: {
          rooms: setRoomStatus(roomId, "occupied"),
        },
      },
      {
        // set numVacancies to number of rooms minus number of sessions
        $set: {
          numVacancies: setNumVacancies,
        },
      },
    ]);
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const checkOutRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const updatedShop = await shopService.updateShopById(
      req.shopId,
      // increment numVacancies if <= capacity
      [
        {
          $set: {
            sessions: {
              $filter: {
                input: "$sessions",
                as: "session",
                cond: { $ne: ["$$session.roomId", roomId] },
              },
            },
          },
        },
        {
          $set: {
            rooms: setRoomStatus(roomId, "available"),
          },
        },
        {
          $set: {
            numVacancies: setNumVacancies,
          },
        },
      ]
    );
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const bookRoom = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const { roomId, startTime, endTime, userId } = req.body;
    const reservation = await reservationService.createReservation({
      shopId,
      roomId,
      startTime,
      endTime,
      userId,
    });
    res.status(200).json(reservation);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};
