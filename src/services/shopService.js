import User from "../models/User.js";
import Shop from "../models/Shop.js";
import mongoose from "mongoose";

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
      { session: session, new: true }
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
      { session: session, new: true }
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

export const updateShopById = async (id, update, options = { new: true }) => {
  try {
    const updatedShop = await Shop.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
    return updatedShop;
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
    shop.rooms.push(room);
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
