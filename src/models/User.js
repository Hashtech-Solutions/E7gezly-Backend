import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: false,
  },
  role: {
    type: String, // "admin" | "shopModerator" | "customer"
    required: true,
    enum: ["admin", "shopAdmin", "shopModerator", "customer"],
  },
  fcmTokens: [
    {
      type: String,
      required: false,
      default: [],
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
