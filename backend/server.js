// ✅ Clean & Fixed server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path"); // ✅ thêm
const Availability = require("./models/Availability");
const availabilityRoutes = require("./routes/availability");
const bookingRoutes = require("./routes/booking"); // ✅ thêm

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ nhận form data có note/link
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ phục vụ file ảnh

const SECRET_KEY = "mysecretkey"; // TODO: move to .env

// ===================== //
// 🔹 MongoDB Connection //
// ===================== //
mongoose
  .connect(
    "mongodb+srv://tuananhltv2004_db_user:3129Treslogos@cluster0.cuabu86.mongodb.net/booking-app?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===================== //
// 🔹 Models Definitions //
// ===================== //
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "client" }, // "client" | "admin"
});

const appointmentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  service: String,
  date: String,
  time: String,
  note: String,
  link: String,
});

const User = mongoose.model("User", userSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);

// ===================== //
// 🔹 Middlewares //
// ===================== //
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

// ===================== //
// 🔹 AUTH Routes //
// ===================== //
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, role: role || "client" });
    await user.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });
    res.json({ success: true, token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== //
// 🔹 Appointments //
// ===================== //
app.get("/appointments", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });
    res.json(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
});
const commentRoutes = require("./routes/comment");
app.use("/comments", commentRoutes);

// 🚫 comment route cũ để tránh trùng /book
// app.post("/book", authMiddleware, async (req, res) => { ... });

// ===================== //
// 🔹 Routes //
// ===================== //
app.use("/availability", availabilityRoutes);
app.use("/booking", bookingRoutes); // ✅ booking routes (upload, link, note)

// 🟢 Public API: Client xem slot rảnh theo ngày
app.get("/available", async (req, res) => {
  try {
    const { date } = req.query;
    const technician = "oni";

    const avail = await Availability.findOne({ technician, date: date.trim() });
    const all = avail?.slots?.map((s) => s.trim()).filter(Boolean) || [];

    const booked = await Appointment.find({ date: date.trim() }).select("time");
    const bookedTimes = new Set(booked.map((b) => b.time.trim()));

    const available = all.filter((t) => !bookedTimes.has(t));
    res.json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== //
// 🔹 Admin Cancel Booking //
// ===================== //
app.delete("/admin/bookings/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== //
// 🔹 Health Check //
// ===================== //
app.get("/", (req, res) => res.send("✅ Booking server is running!"));

// ===================== //
// 🔹 Start Server //
// ===================== //
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
