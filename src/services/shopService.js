import User from "../models/User.js";
import Shop from "../models/Shop.js";

export const createShop = async (shop, shopModerator) => {
  let shopModeratorId;
  try {
    let newShopModerator = new User(shopModerator);
    const newShop = new Shop({
      ...shop,
      isOpen: false,
      moderator: newShopModerator._id,
    });
    newShopModerator.shopId = newShop._id;
    shopModeratorId = newShopModerator._id;
    await newShopModerator.save();
    const createdShop = await newShop.save();
    return createdShop;
  } catch (error) {
    // delete the shop moderator if the shop creation fails
    await User.findByIdAndDelete(shopModeratorId);
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
