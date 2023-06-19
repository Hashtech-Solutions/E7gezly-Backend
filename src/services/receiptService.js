import mongoose from "mongoose";
import Receipt from "../models/Receipt.js";
/**
 * Create a new receipt
 * Skip the validation since the data is already validated before calling this function
 * @param {mongoose.Schema.Types.ObjectId} shopId
 * @param {String} roomId
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {Number} timeTotal
 * @param {Number} extraTotal
 * @param {Number} roomTotal
 */

export const createReceipt = async (
  shopId,
  roomId,
  startTime,
  endTime,
  timeTotal,
  extraTotal,
  roomTotal
) => {
  try {
    await Receipt.create({
      shopId,
      roomId,
      startTime,
      endTime,
      timeTotal,
      extraTotal,
      roomTotal,
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get all receipts objects by shop id
 * @param {String} id shop id
 * @returns {Promise<Array<Receipt>>} receipts
 */

export const getReceiptsByShopId = async (id) => {
  try {
    const receipts = await Receipt.find({ shopId: id });
    return receipts;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get all receipts objects by room id
 * @param {String} id room id
 * @returns {Promise<Array<Receipt>>} receipts
 */
export const getReceiptsByRoomId = async (id) => {
  try {
    const receipts = await Receipt.find({ roomId: id });
    return receipts;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get all receipts objects by shop id and date range
 * @param {String} id shop id
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Array<Receipt>>} receipts
 */
export const getShopReceiptsByDateRange = async (id, startDate, endDate) => {
  try {
    const receipts = await Receipt.find({
      shopId: id,
      startTime: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return receipts;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get all receipts objects by room id and date range
 * @param {String} id room id
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Array<Receipt>>} receipts
 */
export const getRoomReceiptsByDateRange = async (id, startDate, endDate) => {
  try {
    const receipts = await Receipt.find({
      roomId: id,
      startTime: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return receipts;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get total room profit by date range
 * @param {String} id room id
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Number>} total
 */

export const getRoomTotalByDateRange = async (id, startDate, endDate) => {
  try {
    const receipts = await Receipt.aggregate([
      {
        $match: {
          roomId: id,
          startTime: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$roomTotal" },
        },
      },
    ]);
    return receipts[0]?.total || 0;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get total shop proft by date range
 * @param {String} id shop id
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Number>} total
 */
export const getShopTotalByDateRange = async (id, startDate, endDate) => {
  try {
    const receipts = await Receipt.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(id), // convert string to ObjectId since in aggregation mongoose doesn't do it automatically
          startTime: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$roomTotal" },
        },
      },
    ]);
    return receipts[0]?.total || 0;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get total shop profit
 * @param {String} id shop id
 * @returns {Promise<Number>} total
 */
export const getShopTotal = async (id) => {
  try {
    const receipts = await Receipt.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(id), // convert string to ObjectId since in aggregation mongoose doesn't do it automatically
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$roomTotal" },
        },
      },
    ]);
    return receipts[0]?.total || 0;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get total room profit
 * @param {String} id room id
 * @returns {Promise<Number>} total
 */
export const getRoomTotal = async (id) => {
  try {
    const receipts = await Receipt.aggregate([
      {
        $match: {
          roomId: id,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$roomTotal" },
        },
      },
    ]);
    return receipts[0]?.total || 0;
  } catch (error) {
    throw new Error(error);
  }
};
