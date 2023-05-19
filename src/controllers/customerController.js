import * as shopService from "../services/shopService.js";

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

export const reserveRoom = async (req, res, next) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user._id;
    const shopId = req.params.shop_id;
    const room = await shopService.reserveRoom(shopId, roomId, {
      startTime,
      endTime,
      userId,
      roomId,
    });
    res.status(200).json(room);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};
