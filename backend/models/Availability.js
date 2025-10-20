const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  technician: { type: String, default: "oni", index: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  slots: [{ type: String }], // ["09:00", "10:30", ...]
}, { timestamps: true });

AvailabilitySchema.index({ technician: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Availability", AvailabilitySchema);
