const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  const { items, totalAmount, address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Delivery address is required" });
  }

  try {
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
    });

    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Order placement failed", error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.book", "title author price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching orders failed", error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.book", "title author price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching all orders failed", error: err.message });
  }
};

// @desc Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// @desc Cancel an order (user only)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the logged-in user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Only allow cancellation if still processing
    if (order.status !== "Processing") {
      return res
        .status(400)
        .json({ message: "Only processing orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cancellation failed", error: err.message });
  }
};
