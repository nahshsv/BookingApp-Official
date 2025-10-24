const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// 🔹 Lấy tất cả bình luận
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Thêm bình luận mới
router.post("/", async (req, res) => {
  try {
    const { name, message, rating, image } = req.body;
    const newComment = new Comment({ name, message, rating, image });
    await newComment.save();
    res.json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
