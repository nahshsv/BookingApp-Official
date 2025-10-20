// backend/routes/availability.js
const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// 🟢 GET: lấy tất cả availability (admin & client đều dùng)
router.get("/", async (req, res) => {
  try {
    const all = await Availability.find().sort({ date: 1 });

    // ✅ Làm sạch dữ liệu trước khi gửi ra
    const cleaned = all.map((a) => ({
      technician: a.technician,
      date: a.date?.trim(),
      slots: (a.slots || []).map((s) => s.trim()).filter(Boolean),
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟣 GET: lấy availability theo ngày
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const day = await Availability.findOne({ date: date.trim() });

    // ✅ Cũng làm sạch ở đây
    if (day) {
      day.date = day.date.trim();
      day.slots = (day.slots || []).map((s) => s.trim()).filter(Boolean);
    }

    res.json(day || { date: date.trim(), slots: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 PUT: admin cập nhật slots cho ngày cụ thể
router.put("/:date", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    const { slots } = req.body;

    // ✅ Làm sạch dữ liệu trước khi lưu
    const cleanedDate = date.trim();
    const cleanedSlots = (slots || []).map((s) => s.trim()).filter(Boolean);

    await Availability.findOneAndUpdate(
      { date: cleanedDate },
      { date: cleanedDate, slots: cleanedSlots },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 DELETE: xóa 1 slot khỏi ngày
router.delete("/:date/:time", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { date, time } = req.params;
    const cleanedDate = date.trim();
    const cleanedTime = time.trim();

    const day = await Availability.findOne({ date: cleanedDate });
    if (!day) return res.status(404).json({ error: "Date not found" });

    // ✅ Loại bỏ slot cần xóa
    day.slots = (day.slots || []).map((s) => s.trim()).filter((s) => s !== cleanedTime);
    await day.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
