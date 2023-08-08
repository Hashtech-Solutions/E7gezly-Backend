import mongoose from "mongoose";
import * as enums from "./enums.js";

const locationSchema = mongoose.Schema({
  long: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
});

const gamesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const roomSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: function () {
      const newId = new mongoose.Types.ObjectId();
      const shopId = this.$__parent._id;
      return `${shopId}-${newId}`;
    },
  },
  availableGames: [gamesSchema],
  roomType: {
    type: String,
    enum: enums.shopEnums.roomTypes,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["occupied", "available"],
  },
  hourlyRate: {
    type: Number,
    required: false,
  },
  capacity: {
    type: Number,
    required: false,
  },
  availableServices: [
    {
      type: String,
    },
  ],
});

const shopSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  image: {
    type: String,
    required: false,
  },

  isOpen: {
    type: Boolean,
    required: true,
  },
  // google maps coordinates
  location: {
    type: locationSchema,
    required: false,
  },
  baseHourlyRate: {
    type: Number,
  },
  shopAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopModerators: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      email: {
        type: String,
        required: true,
      },
    },
  ],
  availableGames: [gamesSchema],
  availableServices: [
    {
      type: String,
    },
  ],
  rooms: [
    {
      type: roomSchema,
    },
  ],
  sessions: [
    {
      roomId: {
        type: String,
        ref: "Room",
        required: true,
      },
      roomName: {
        type: String,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: false,
      },
      extras: [
        {
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          total: {
            type: Number,
            required: true,
          },
        },
      ],
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
  ],
  numVacancies: {
    type: Number,
  },
  extras: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  gameSearches: {
    type: Number,
    default: 0,
  },
  availableActivities: [
    {
      type: String,
    },
  ],
});

// verify that roomNames are unique for the same shop
shopSchema.pre("save", async function (next) {
  const shop = this;
  const roomNames = shop.rooms.map((room) => room.name);
  const uniqueRoomNames = new Set(roomNames);
  if (roomNames.length !== uniqueRoomNames.size) {
    throw new Error("Room names must be unique");
  }
  next();
});
const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
