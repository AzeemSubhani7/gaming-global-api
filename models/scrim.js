const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScrimSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    scrimTitle: { type: String, required: true },
    scrimText: { type: String, required: true },
    game: { type: String, required: true },
    going: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Scrim", ScrimSchema)