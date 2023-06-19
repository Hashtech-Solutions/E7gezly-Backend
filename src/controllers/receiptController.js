import * as receiptService from "../services/receiptService.js";

export const getReceiptsByShopId = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const startDate = req.query?.start_date || "";
    const endDate = req.query?.end_date || "";
    let receipts = [];
    if (!startDate || startDate === "" || !endDate || endDate === "") {
      receipts = await receiptService.getReceiptsByShopId(shopId);
    } else {
      receipts = await receiptService.getShopReceiptsByDateRange(
        shopId,
        startDate,
        endDate
      );
    }
    res.status(200).json(receipts);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const getReceiptsByRoomId = async (req, res, next) => {
  try {
    const roomId = req.params.room_id;
    const startDate = req.query?.start_date || "";
    const endDate = req.query?.end_date || "";
    let receipts = [];
    if (!startDate || startDate === "" || !endDate || endDate === "") {
      receipts = await receiptService.getReceiptsByRoomId(roomId);
    } else {
      receipts = await receiptService.getRoomReceiptsByDateRange(
        roomId,
        startDate,
        endDate
      );
    }
    res.status(200).json(receipts);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const getShopTotal = async (req, res, next) => {
  try {
    const shopId = req.shopId;
    const startDate = req.query?.start_date || "";
    const endDate = req.query?.end_date || "";
    let total = 0;
    if (!startDate || startDate === "" || !endDate || endDate === "") {
      total = await receiptService.getShopTotal(shopId);
    } else {
      total = await receiptService.getShopTotalByDateRange(
        shopId,
        startDate,
        endDate
      );
    }
    res.status(200).json(total);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const getRoomTotal = async (req, res, next) => {
  try {
    const roomId = req.params.room_id;
    const startDate = req.query?.start_date || "";
    const endDate = req.query?.end_date || "";
    let total = 0;
    if (!startDate || startDate === "" || !endDate || endDate === "") {
      total = await receiptService.getRoomTotal(roomId);
    } else {
      total = await receiptService.getRoomTotalByDateRange(
        roomId,
        startDate,
        endDate
      );
    }
    res.status(200).json(total);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};
