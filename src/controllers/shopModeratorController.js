import * as shopService from "../services/shopService.js";

const setNumVacancies = {
  $subtract: [{ $size: "$rooms" }, { $size: { $ifNull: ["$sessions", []] } }],
};

export const updateShopInfo = async (req, res, next) => {
  try {
    const { location, baseHourlyRate, rooms, availableActivities, services } =
      req.body;
    const updatedShop = await shopService.updateShopById(req.shopId, {
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
    const { availableActivities, hourlyRate } = req.body;
    const roomId = req.params.room_id;
    const updatedShop = await shopService.updateShopById(
      req.shopId,
      {
        "rooms.$[elem].availableActivities": availableActivities,
        "rooms.$[elem].hourlyRate": hourlyRate,
      },
      { arrayFilters: [{ "elem._id": roomId }], new: true }
    );
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const toggleStatus = async (req, res, next) => {
  try {
    const { isOpen } = req.body;
    const updatedShop = await shopService.updateShopById(req.shopId, [
      { $set: { isOpen } },
      // set numVacancies to capacity of all rooms if open and 0 if closed
      // {
      //   $set: {
      //     numVacancies: {
      //       $cond: {
      //         if: { $eq: ["$isOpen", true] },
      //         then: { $size: "$rooms" },
      //         else: 0,
      //       },
      //     },
      //   },
      // },
    ]);
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const checkInRoom = async (req, res, next) => {
  try {
    const roomId = req.params.room_id;
    const { userId } = req.body;
    const shop = await shopService.getShopById(req.shopId);
    const session = shopService.getSessionByRoomId(shop, roomId);
    if (session) {
      return next({
        status: 400,
        message: "Room is already occupied",
      });
    }
    const updatedShop = await shopService.updateShopById(req.shopId, [
      {
        $set: {
          sessions: [
            ...shop.sessions,
            {
              roomId,
              roomName: shop.rooms.find((room) => `${room._id}` === `${roomId}`)
                .name,
              startTime: new Date(),
            },
          ],
        },
      },
      {
        // set numVacancies to number of rooms minus number of sessions
        $set: {
          numVacancies: setNumVacancies,
        },
      },
    ]);
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};

export const checkOutRoom = async (req, res, next) => {
  try {
    const roomId = req.params.room_id;
    const updatedShop = await shopService.updateShopById(
      req.shopId,
      // increment numVacancies if <= capacity
      [
        {
          $set: {
            sessions: {
              $filter: {
                input: "$sessions",
                as: "session",
                cond: { $ne: ["$$session.roomId", roomId] },
              },
            },
          },
        },
        {
          $set: {
            numVacancies: setNumVacancies,
          },
        },
      ]
    );
    res.status(200).json(updatedShop);
  } catch (error) {
    return next({ status: 400, message: error }, req, res, next);
  }
};
