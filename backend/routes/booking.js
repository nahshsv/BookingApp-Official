// backend/routes/booking.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const { authMiddleware } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs"); // ✅ thêm để chuẩn hóa format ngày

// ===================== //
// 🔹 File Upload Config //
// ===================== //
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // tự tạo folder nếu chưa có

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// ===================== //
// 🔹 ROUTES //
// ===================== //

// 📅 Public route - lấy slot trống theo ngày
router.get("/available", async (req, res) => {
  const { date } = req.query;
  const technician = "oni";

  try {
    // ✅ chuẩn hóa format ngày
    const normalizedDate = dayjs(date).format("YYYY-MM-DD");

    const avail = await Availability.findOne({ technician, date: normalizedDate });
    const allSlots = avail?.slots || [];

    const booked = await Booking.find({
      technician,
      date: normalizedDate,
      status: "confirmed",
    }).select("time");

    const bookedSet = new Set(booked.map((b) => b.time));
    const available = allSlots.filter((t) => !bookedSet.has(t));

    res.json(available);
  } catch (err) {
    console.error("❌ Error fetching available slots:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✍️ Tạo booking mới (hỗ trợ note, link, file upload)
router.post("/book", upload.single("file"), async (req, res) => {
  try {
    let { name, email, service, date, time, note, link } = req.body;
    const technician = "oni";
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // ✅ chuẩn hóa lại format ngày
    date = dayjs(date).format("YYYY-MM-DD");

    // kiểm tra slot đã bị đặt chưa
    const exist = await Booking.findOne({
      technician,
      date,
      time,
      status: "confirmed",
    });
    if (exist) return res.status(400).json({ error: "Slot already booked" });

    // tạo booking mới
    const doc = await Booking.create({
      technician,
      name,
      email,
      service,
      date,
      time,
      note: note || "",
      link: link || "",
      imagePath,
      status: "confirmed",
    });

    res.json({ ok: true, booking: doc });
  } catch (e) {
    console.error("❌ Booking error:", e);
    res.status(500).json({ error: e.message });
  }
});

// 🧾 Admin - xem booking
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const scope = req.query.scope || "upcoming";
    const today = dayjs().format("YYYY-MM-DD"); // ✅ dùng dayjs

    const filter = { status: "confirmed" };
    if (scope === "upcoming") filter.date = { $gte: today };
    if (scope === "past") filter.date = { $lt: today };

    const bookings = await Booking.find(filter).sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Admin booking fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ❌ Admin - hủy booking
router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📆 Admin - lấy/cập nhật availability
router.get("/availability", authMiddleware, async (req, res) => {
  try {
    const list = await Availability.find().sort({ date: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/availability", authMiddleware, async (req, res) => {
  try {
    const updates = req.body.days; // [{date, slots}]
    const technician = "oni";

    const ops = updates.map((d) => {
      const normalizedDate = dayjs(d.date).format("YYYY-MM-DD"); // ✅ chuẩn hóa ngày
      return {
        updateOne: {
          filter: { technician, date: normalizedDate },
          update: { $set: { slots: d.slots } },
          upsert: true,
        },
      };
    });

    if (ops.length) await Availability.bulkWrite(ops);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
