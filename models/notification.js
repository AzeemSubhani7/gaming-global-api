const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Notification = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  notifications: [
    {
      type: { type: String, enum: ["newfollower", "newlike", "newcomment"] },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      post: { type: Schema.Types.ObjectId, ref: "Post" },
      text: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
})

module.exports = mongoose.model("Notification", Notification);