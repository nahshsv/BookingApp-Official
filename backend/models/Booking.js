// backend/models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    technician: { type: String, default: "oni", index: true },
    name: String,
    email: String,
    service: String,
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    // ✅ Thêm 3 trường mới (chỉ thêm, không ảnh hưởng logic cũ)
    note: { type: String, default: "" },        // ghi chú của khách
    link: { type: String, default: "" },        // link hình mẫu
    imagePath: { type: String, default: "" },   // đường dẫn ảnh upload
  },
  { timestamps: true }
);

// Vẫn giữ index cũ
BookingSchema.index({ technician: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Booking", BookingSchema);
