const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, default: 5 }, // optional: sao đánh giá
  image: { type: String }, // optional: hình móng tay họ post
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
