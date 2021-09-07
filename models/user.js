const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSchema = new schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: false },
    role: { type: String, default: "user", enum: ["user", "root"] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema)

module.exports = User;