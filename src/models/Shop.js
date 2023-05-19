import mongoose from "mongoose";

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

const availableGamesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const activity = {
  type: String,
  enum: ["ps5", "ps4", "pc", "table tennis", "pool", "netflix"],
};

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
  status: {
    type: String,
    enum: ["occupied", "available"],
  },
  hourlyRate: {
    type: Number,
    required: false,
  },
  availableActivities: [activity],
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
  availableGames: [availableGamesSchema],
  rooms: [
    {
      type: roomSchema,
    },
  ],
  sessions: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
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
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
  ],
  reservations: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
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
        required: true,
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
  availableActivities: [activity],
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
