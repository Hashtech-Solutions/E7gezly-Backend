import * as shopService from "../services/shopService.js";

export const updateShopInfo = async (req, res, next) => {
  try {
    const { location, baseHourlyRate, rooms, availableActivities, services } =
      req.body;
    const updatedShop = await shopService.updateShopById(req.params.id, {
      location,
      baseHourlyRate,
      availableActivities,
      services,
    });
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export const addRoom = async (req, res, next) => {
  try {
    const room = await shopService.addRoom(req.shopId, req.body);
    res.status(200).json(room);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updateObject = { $set: { "rooms.$[elem]": req.body } };
    const options = { arrayFilters: [{ "elem._id": req.params.roomId }] };
    const room = await shopService.updateShopById(
      req.params.id,
      updateObject,
      options
    );
    res.status(200).json(room);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};
