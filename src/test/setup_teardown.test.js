import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to a local test database before running any tests.
before(async () => {
  const url = process.env.MONGO_TEST_URL;
  await mongoose.connect(url);
});

// Drop database after all tests are done.
after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
