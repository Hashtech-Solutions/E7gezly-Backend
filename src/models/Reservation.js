import mongoose from "mongoose";

export const reservationSchema = mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    index: true,
  },
  roomId: {
    type: String,
    ref: "Room",
    required: true,
    index: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    index: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

export const Reservation = mongoose.model("Reservation", reservationSchema);
