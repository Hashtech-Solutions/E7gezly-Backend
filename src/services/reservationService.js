import {Reservation} from "../models/Reservation.js";
import Shop from "../models/Shop.js";
import * as userService from "./userService.js";
import {emitEvent} from "../socket.js";

const validateOverlappingReservations = async (reservation) => {
  try {
    const existingReservations = await Reservation.find({
      roomId: reservation.roomId,
      startTime: {$lt: reservation.endTime},
      endTime: {$gt: reservation.startTime},
    });
    if (existingReservations.length > 0) {
      throw new Error("Room is already reserved");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRoomUpcomingReservation = async (shopId, roomId) => {
  try {
    const reservation = await Reservation.find({
      shopId: shopId,
      roomId: roomId,
      // reservations with startTime within 25 minutes from now
      startTime: {$lt: new Date(new Date().getTime() + 25 * 60 * 1000)},
      endTime: {$gt: new Date()},
    });
    return reservation;
  } catch (error) {
    throw new Error(error);
  }
};

const getShopRoom = async (shopId, roomId) => {
  try {
    const shop = await Shop.findOne(
      {
        _id: shopId,
        rooms: {$elemMatch: {_id: roomId}},
      },
      {rooms: {$elemMatch: {_id: roomId}}}
    );
    if (!shop) {
      throw new Error("Room does not exist");
    }
    return shop;
  } catch (error) {
    throw new Error(error);
  }
};

export const createReservation = async (reservation) => {
  try {
    await validateOverlappingReservations(reservation);
    const newReservation = await Reservation.create(reservation);
    emitEvent(reservation.shopId, "addReservation", newReservation);
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
    emitEvent(reservation.shopId, "deleteReservation", reservationId);
    if (reservation.userId) {
      userService.sendNotification(reservation.userId, {
        deleted: "true",
        shopId: reservation.shopId,
        startTime: reservation.startTime,
      });
    }
    return reservation;
  } catch (error) {
    throw new Error(error);
  }
};

export const confirmRoomReservation = async (reservation) => {
  try {
    const shop = await getShopRoom(reservation.shopId, reservation.roomId);
    const room = shop.rooms[0];
    const roomReservation = await room.reservations.find(
      (r) => `${r._id}` === `${reservation._id}`
    );
    roomReservation.confirmed = true;
    await shop.save();
    return roomReservation;
  } catch (error) {
    throw new Error(error);
  }
};

export const confirmReservationById = async (reservationId) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {confirmed: true},
      {new: true}
    );
    if (!reservation) {
      throw new Error("Reservation does not exist");
    }
    await confirmRoomReservation(reservation);
    emitEvent(reservation.shopId, "confirmReservation", reservation);
    if (reservation.userId) {
      userService.sendNotification(reservation.userId, {
        confirmed: "true",
        shopId: reservation.shopId,
        startTime: reservation.startTime,
      });
    }
    return reservation;
  } catch (error) {
    throw new Error(error);
  }
};
