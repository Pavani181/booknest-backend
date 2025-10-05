// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // ✅ Add multer middleware

// Public routes
router.get("/", getBooks);
router.get("/:id", getBookById);

// Admin-only routes with image upload
router.post("/", protect, adminOnly, upload.single("image"), createBook); // ✅ file upload
router.put("/:id", protect, adminOnly, upload.single("image"), updateBook); // ✅ optional image update
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
