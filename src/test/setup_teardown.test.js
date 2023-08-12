import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// connect to database before each test
beforeEach(async () => {
  const url = process.env.MONGO_TEST_URL;
  try {
    await mongoose.connect(url);
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.log(error);
  }
});

afterEach(async () => {
  await mongoose.connection.close();
});
