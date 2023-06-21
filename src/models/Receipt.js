import mongoose from "mongoose";

const receiptSchema = mongoose.Schema({
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
  timeTotal: {
    type: Number,
    required: true,
  },
  extraTotal: {
    type: Number,
    required: true,
  },
  roomTotal: {
    type: Number,
    required: true,
  },
});

const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
