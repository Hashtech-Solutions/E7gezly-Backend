import Shop from "../models/Shop.js";
import User from "../models/User.js";
import {Reservation} from "../models/Reservation.js";

export const createShop = async () => {
  const newAdmin = new User({
    userName: "testAdmin",
    password: "testPassword",
    role: "shopAdmin",
  });
  const newShop = new Shop({
    name: "testShop",
    shopAdminId: newAdmin._id,
    rooms: [
      {
        roomType: "ps4",
        name: "room1",
        status: "available",
        capacity: 4,
      },
    ],
    isOpen: true,
  });
  await newAdmin.save();
  const shop = await newShop.save();
  return shop;
};

export const createReservation = async (shop, room, startTime, endTime) => {
  const newReservation = new Reservation({
    shopId: shop._id,
    roomId: room._id,
    startTime: startTime,
    endTime: endTime,
  });
  const reservation = newReservation.save();
  return reservation;
};
