import Reservation from "../models/Reservation.js";
import Shop from "../models/Shop.js";

export const createReservation = async (reservation) => {
  try {
    const existingReservations = await Reservation.find({
      roomId: reservation.roomId,
      startTime: { $lt: reservation.endTime },
      endTime: { $gt: reservation.startTime },
    });
    // validae that room is in shop
    const room = await Shop.findOne(
      {
        _id: reservation.shopId,
        rooms: { $elemMatch: { _id: reservation.roomId } },
      },
      { rooms: { $elemMatch: { _id: reservation.roomId } } }
    );

    if (!room) {
      throw new Error("Room does not exist");
    }

    if (existingReservations.length > 0) {
      throw new Error("Room is already reserved");
    }
    const newReservation = await Reservation.create(reservation);
    return newReservation;
  } catch (error) {
    throw new Error(error);
  }
};

export const getManyReservations = async (query) => {
  try {
    const reservations = await Reservation.find(query);
    return reservations;
  } catch (error) {
    throw new Error(error);
  }
};
