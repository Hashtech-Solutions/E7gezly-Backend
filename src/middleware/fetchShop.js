const fetchShopId = async (req, res, next) => {
  const shopId = req.headers["shop-id"];
  if (!shopId) {
    return next({
      status: 400,
      message: "Shop Id is required",
    });
  }
  req.shopId = shopId;
  next();
};

export default fetchShopId;
