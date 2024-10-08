import User from "../models/User.js";
import Shop from "../models/Shop.js";
import mongoose from "mongoose";
// import {emitEvent} from "../socket.js";

import {
  getRoomUpcomingReservation,
  deleteReservationById,
} from "./reservationService.js";

import {
  checkDatabaseForGameSearch,
  checkAPIForGameSearch,
  saveGameSearchToDatabase,
} from "./shopUtils.js";

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
        if: {$eq: ["$$room._id", roomId]},
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

export const createShop = async (shop, shopAdmin) => {
  let shopAdminId;
  try {
    let newShopAdmin = new User(shopAdmin);
    const newShop = new Shop({
      ...shop,
      isOpen: false,
      shopAdminId: newShopAdmin._id,
    });
    newShopAdmin.shopId = newShop._id;
    shopAdminId = newShopAdmin._id;
    await newShopAdmin.save();
    const createdShop = await newShop.save();
    return createdShop;
  } catch (error) {
    // delete the shop moderator if the shop creation fails
    await User.findByIdAndDelete(shopAdminId);
    throw new Error(error);
  }
};

export const createShopModerator = async (shopModerator) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const shopModeratorUser = new User(shopModerator);
    const createdShopModerator = await shopModeratorUser.save({
      session: session,
    });

    await Shop.findByIdAndUpdate(
      shopModerator.shopId,
      {
        $push: {
          shopModerators: {
            _id: createdShopModerator._id,
            userName: createdShopModerator.userName,
          },
        },
      },
      {session: session, new: true}
    );
    await session.commitTransaction();
    session.endSession();
    return createdShopModerator;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

export const removeShopModerator = async (shopModeratorId) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const shopModerator = await User.findByIdAndDelete(shopModeratorId, {
      session: session,
    });
    await Shop.findByIdAndUpdate(
      shopModerator.shopId,
      {
        $pull: {
          shopModerators: {
            _id: shopModeratorId,
          },
        },
      },
      {session: session, new: true}
    );
    await session.commitTransaction();
    session.endSession();
    return shopModerator;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

export const getManyShops = async (query, select = "") => {
  try {
    const shops = await Shop.find(query).select(select);
    return shops;
  } catch (error) {
    throw new Error(error);
  }
};

export const getShopById = async (id) => {
  try {
    const shop = await Shop.findById(id);
    return shop;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSessionByRoomId = (shop, roomId) => {
  const session = shop.sessions.find(
    (session) => `${session.roomId}` === `${roomId}`
  );
  return session;
};

export const checkInRoom = async (
  shopId,
  sessionBody,
  reservation_id = null
) => {
  try {
    const {roomId, userId, endTime} = sessionBody;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }
    const existingSession = getSessionByRoomId(shop, roomId);
    if (existingSession) {
      throw new Error("Room is already occupied");
    }
    let reservation;
    if (reservation_id) {
      reservation = await deleteReservationById(reservation_id);
    }
    const updatedShop = await updateShopById(shopId, [
      {
        $set: {
          sessions: [
            ...shop.sessions,
            {
              roomId,
              roomName: shop.rooms.find((room) => `${room._id}` === `${roomId}`)
                .name,
              startTime: new Date().toISOString(),
              endTime: endTime ? endTime : reservation?.endTime,
              userId,
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
    const session = getSessionByRoomId(updatedShop, roomId);
    const returnValue = {
      session,
      numVacancies: updatedShop.numVacancies,
    };
    return returnValue;
  } catch (error) {
    throw new Error(error);
  }
};

export const checkOutRoom = async (shopId, roomId) => {
  try {
    const updatedShop = await updateShopById(
      shopId,
      // increment numVacancies if <= capacity
      [
        {
          $set: {
            sessions: {
              $filter: {
                input: "$sessions",
                as: "session",
                cond: {$ne: ["$$session.roomId", roomId]},
              },
            },
            rooms: setRoomStatus(roomId, "available"),
          },
        },
        {
          $set: {
            numVacancies: setNumVacancies, // after the first $set is executed, numVacancies is updated
          },
        },
      ]
    );
    const returnValue = {
      numVacancies: updatedShop.numVacancies,
      roomId,
    };
    return returnValue;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateShopById = async (id, update, options = {new: true}) => {
  try {
    const updatedShop = await Shop.findOneAndUpdate({_id: id}, update, options);
    return updatedShop;
  } catch (error) {
    throw new Error(error);
  }
};

export const addExtraToSession = async (id, roomId, extra) => {
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    const session = await getSessionByRoomId(shop, roomId);
    if (!session) {
      throw new Error("Session not found");
    }
    const shopExtra = shop.extras.find(
      (shopExtra) => shopExtra.name === extra.name
    );
    if (!shopExtra) {
      throw new Error("Extra not found in shop");
    }
    const extraTotal = shopExtra.price * extra.quantity;

    session.extras = session.extras
      ? [
          ...session.extras,
          {name: extra.name, quantity: extra.quantity, total: extraTotal},
        ]
      : [{name: extra.name, quantity: extra.quantity, total: extraTotal}];
    await shop.save();
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const addExtra = async (id, extra) => {
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    shop.extras.push(extra);
    await shop.save();
    return shop.extras;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeExtra = async (id, extraName) => {
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    shop.extras = shop.extras.filter((extra) => extra.name !== extraName);
    await shop.save();
    return shop.extras;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateExtra = async (id, extra) => {
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    const existingExtra = shop.extras.find(
      (existingExtra) => existingExtra.name === extra.name
    );
    if (!existingExtra) {
      throw new Error("Extra not found");
    }
    existingExtra.price = extra.price;
    await shop.save();
    return shop.extras;
  } catch (error) {
    throw new Error(error);
  }
};

const computeTimeTotal = (startTime, endTime, shop, roomId) => {
  const room = shop.rooms.find((room) => `${room._id}` === `${roomId}`);
  const timeInHours = (endTime - startTime) / 1000 / 60 / 60;
  const timeTotal = Math.ceil(
    room.hourlyRate
      ? timeInHours * room.hourlyRate
      : timeInHours * shop.baseHourlyRate
  );
  return timeTotal ? timeTotal : 0;
};

const computeExtraTotal = (extras, shopExtras) => {
  const extraTotal = extras.reduce((total, extra) => {
    const shopExtra = shopExtras.find(
      (shopExtra) => shopExtra.name === extra.name
    );
    return total + shopExtra.price * extra.quantity;
  }, 0);
  return Math.ceil(extraTotal);
};

export const computeSessionTotal = async (id, roomId) => {
  try {
    const shop = await getShopById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    const session = getSessionByRoomId(shop, roomId);
    if (!session) {
      throw new Error("Session not found");
    }
    const startTime = new Date(session.startTime);
    const endTime = new Date();
    const timeTotal = computeTimeTotal(startTime, endTime, shop, roomId);
    const extrasTotal = session.extras.reduce(
      (agg, extra) => extra.total + agg,
      0
    );
    return {
      startTime,
      endTime,
      timeTotal,
      extraTotal: extrasTotal,
      roomTotal: timeTotal + extrasTotal,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const addRoom = async (id, room) => {
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    if (!room.hourlyRate && !shop.baseHourlyRate) {
      throw new Error("Room or shop must have hourly rate");
    }
    shop.rooms.push(room);
    await shop.save();
    return shop;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateRoom = async (id, roomId, room) => {
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error("Shop not found");
    }
    const existingRoom = shop.rooms.find(
      (existingRoom) => `${existingRoom._id}` === `${roomId}`
    );
    if (!existingRoom) {
      throw new Error("Room not found");
    }
    // update existing room with new room data
    const updatedRoom = Object.assign(existingRoom, room);
    shop.rooms = shop.rooms.map((r) =>
      `${r._id}` === `${roomId}` ? updatedRoom : r
    );
    await shop.save();
    return shop;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteShopById = async (id) => {
  try {
    const deletedShop = await Shop.findByIdAndDelete(id);
    return deletedShop;
  } catch (error) {
    throw new Error(error);
  }
};

export const findGame = async (id, searchTerm) => {
  try {
    searchTerm = searchTerm.toLowerCase();
    const databaseResult = await checkDatabaseForGameSearch(searchTerm);
    if (databaseResult) {
      return databaseResult;
    }
    const shop = await Shop.findById(id);
    if (shop.gameSearches >= 200) {
      throw new Error("Maximum number of searches reached");
    }

    const apiResult = await checkAPIForGameSearch(searchTerm);
    const newGameSearch = {
      searchTerm: searchTerm,
      results: apiResult.results,
    };
    await saveGameSearchToDatabase(newGameSearch, shop);
    return apiResult.results;
  } catch (error) {
    throw new Error(error);
  }
};
