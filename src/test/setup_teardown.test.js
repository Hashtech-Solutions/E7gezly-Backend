import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import * as shopAdminController from "../controllers/shopAdminController.js";
import errorHandler from "../middleware/errorHandler.js";

dotenv.config();

// have shopId as global variable to use in all tests
global.shopId = "";
global.customerId = "";

// Connect to a local test database before running any tests.
before(async () => {
  console.log("Running before all tests");
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
  const shop = await shopAdminController.createShop(req, res, errorHandler);
  global.shopId = res.data._id;
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
