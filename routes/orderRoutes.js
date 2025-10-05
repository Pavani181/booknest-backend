const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  cancelOrder,
  updateOrderStatus, // ✅ add this
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Protected routes
router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
// Cancel an order (user only)
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes
router.get("/all", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus); // ✅ add this

module.exports = router;
