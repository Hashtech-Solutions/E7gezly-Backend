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

// set the room name to unique within the shop
shopSchema.index({ name: 1, "rooms.name": 1 }, { unique: true });

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
