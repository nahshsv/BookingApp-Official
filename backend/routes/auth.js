// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || "oni";
const ADMIN_PASS = process.env.ADMIN_PASS || "supersecret";
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

module.exports = router;
