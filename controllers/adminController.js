const User = require("../models/User");

// @desc   Get all users
// @route  GET /api/admin/users
// @access Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};
