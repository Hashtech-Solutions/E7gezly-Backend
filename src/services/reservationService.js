import { Reservation } from "../models/Reservation.js";
import Shop from "../models/Shop.js";

const validateOverlappingReservations = async (reservation) => {
  try {
    const existingReservations = await Reservation.find({
      roomId: reservation.roomId,
      startTime: { $lt: reservation.endTime },
      endTime: { $gt: reservation.startTime },
    });
    if (existingReservations.length > 0) {
      throw new Error("Room is already reserved");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getShopRoom = async (shopId, roomId) => {
  try {
    const shop = await Shop.findOne(
      {
        _id: shopId,
        rooms: { $elemMatch: { _id: roomId } },
      },
      { rooms: { $elemMatch: { _id: roomId } } }
    );
    if (!shop) {
      throw new Error("Room does not exist");
    }
    return shop;
  } catch (error) {
    throw new Error(error);
  }
};

const addReservationToRoom = async (reservation, shop) => {
  try {
    const room = shop.rooms[0];
    room.reservations.push(reservation);
    await shop.save();
  } catch (error) {
    throw new Error(error);
  }
};

const removeReservationFromRoom = async (reservationId, shop) => {
  try {
    const room = shop.rooms[0];
    room.reservations = room.reservations.filter(
      (reservation) => `${reservation._id}` !== `${reservationId}`
    );
    await shop.save();
  } catch (error) {
    throw new Error(error);
  }
};

export const createReservation = async (reservation) => {
  try {
    await validateOverlappingReservations(reservation);
    const shop = await getShopRoom(reservation.shopId, reservation.roomId);
    const newReservation = await Reservation.create(reservation);
    await addReservationToRoom(newReservation, shop);
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

export const deleteReservationById = async (reservationId) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      throw new Error("Reservation does not exist");
    }
    const shop = await getShopRoom(reservation.shopId, reservation.roomId);
    await removeReservationFromRoom(reservationId, shop);
    return reservation;
  } catch (error) {
    throw new Error(error);
  }
};
