import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import errorHandler from "../middleware/errorHandler.js";
import * as adminController from "../controllers/adminController.js";

dotenv.config();

// have shopId as global variable to use in all tests
global.shopId = "";
global.customerId = "";
global.room1Id = "";
global.room2Id = "";

// Connect to a local test database before running any tests.
before(async () => {
  const url = process.env.MONGO_TEST_URL;
  await mongoose.connect(url);
  const req = {
    body: {
      userName: "globalTest",
      password: "test",
      name: "globalTest",
      rooms: [
        {
          name: "room1",
          status: "available",
        },
        {
          name: "room2",
          status: "available",
          hourlyRate: 10,
        },
      ],
      availableActivities: ["ps4"],
    },
  };
  const res = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.data = data;
      return this;
    },
  };
  const shop = await adminController.createShop(req, res, errorHandler);
  global.shopId = res.data._id;
  global.room1Id = res.data.rooms[0]._id;
  global.room2Id = res.data.rooms[1]._id;
  const customer = await User.create({
    userName: "customer",
    password: "test",
    role: "customer",
  });
  global.customerId = customer._id;
});

// Drop database after all tests are done.
after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
