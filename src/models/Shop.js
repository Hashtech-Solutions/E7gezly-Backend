import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

const activitiesSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // auto-generate a new ObjectId
    default: () => new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: false,
  },
  availableActivities: [
    {
      type: activitiesSchema,
    },
  ],
});

const shopSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rooms: [
    {
      type: roomSchema,
    },
  ],
  occupiedRooms: [
    {
      roomID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
        unique: true,
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
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
  ],
  numVacancies: {
    type: Number,
  },
  services: [
    {
      name: {
        type: String,
        required: true,
      },
      extraRate: {
        type: Number,
        required: true,
      },
    },
  ],
  availableActivities: [
    {
      type: activitiesSchema,
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
