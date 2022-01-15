const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatchSchema = new Schema(
  {
    title: { type: String },
    patch: { type: String },
    text: { type: String },
    for: { type: String, enum: ["fortnite", "rainbow"] },
    
  },
  { timestamps: true }
)

module.exports = mongoose.model("Patch", PatchSchema)