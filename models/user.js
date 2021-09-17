const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSchema = new schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: false },
    role: { type: String, default: "user", enum: ["user", "root"] },
    token: { type: String, required: true },
    bio: { type: String },
    userAvatar: { type: String },
    newMessagePopup: { type: Boolean, default: false },
    unreadMessage: { type: Boolean, default: false },
    unreadNotification: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema)

module.exports = User;