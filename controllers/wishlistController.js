const User = require("../models/User");
const Book = require("../models/Book");

// Add book to wishlist
exports.addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user.wishlist.includes(bookId)) {
      user.wishlist.push(bookId);
      await user.save();
    }
    res.json({ message: "Book added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: err.message });
  }
};

// Remove book from wishlist
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;

  try {
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
    await user.save();
    res.json({
      message: "Book removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err.message });
  }
};

// Get all wishlist books
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: err.message });
  }
};
