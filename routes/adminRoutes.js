const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Book = require("../models/Book");
const Order = require("../models/Order");

// GET /api/admin/stats - dashboard metrics
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ totalUsers, totalBooks, totalOrders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: error.message });
  }
});

// GET /api/admin/orders - all orders (admin only)
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // populate user info
      .populate("items.book", "title"); // populate book titles
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
});

// GET /api/admin/users - Admin can view all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password field
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
});

module.exports = router;
