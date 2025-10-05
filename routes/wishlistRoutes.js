const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/:bookId", protect, addToWishlist);
router.delete("/:bookId", protect, removeFromWishlist);

module.exports = router;
