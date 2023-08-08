import * as shopService from "../services/shopService.js";

export const createShop = async (req, res, next) => {
  try {
    let {email, firebaseUID, ...shop} = req.body;
    const shopModerator = {
      email,
      firebaseUID,
      role: "shopAdmin",
    };
    const createdShop = await shopService.createShop(shop, shopModerator);
    res.status(200).json(createdShop);
  } catch (error) {
    return next({status: 400, message: error}, req, res, next);
  }
};

export const getManyShops = async (req, res, next) => {
  try {
    const shops = await shopService.getManyShops(req.query);
    res.status(200).json(shops);
  } catch (error) {
    return next({status: 400, message: error});
  }
};

export const getShopById = async (req, res, next) => {
  try {
    const shop = await shopService.getShopById(req.params.id);
    res.status(200).json(shop);
  } catch (error) {
    return next({status: 400, message: error});
  }
};

export const updateShopById = async (req, res, next) => {
  try {
    const updatedShop = await shopService.updateShopById(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({status: 400, message: error});
  }
};

export const deleteShopById = async (req, res, next) => {
  try {
    const deletedShop = await shopService.deleteShopById(req.params.id);
    res.status(200).json(deletedShop);
  } catch (error) {
    return next({status: 400, message: error});
  }
};
