const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    reportText: { type: String }
    
  },
  { timestamps: true }
)

module.exports = mongoose.model("Report", ReportSchema)