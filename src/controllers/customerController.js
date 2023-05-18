import * as shopService from "../services/shopService.js";

export const getManyShops = async (req, res, next) => {
  try {
    const shops = await shopService.getManyShops(
      req.query,
      "name numVacancies availableActivities"
    );
    res.status(200).json(shops);
  } catch (error) {
    return next({ status: 400, message: error });
  }
};
