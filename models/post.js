const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    postText: { type: String, required: true },
    postImageUrl: { type: String},
    postLikes: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" }
      }
    ],
    postComments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("Post", PostSchema)