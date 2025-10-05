// controllers/bookController.js
const Book = require("../models/Book");

// @desc Create a book
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const book = await Book.create({
      title,
      author,
      genre,
      price,
      description,
      image, // ✅ Save image file name
    });

    res.status(201).json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Book creation failed", error: err.message });
  }
};

// @desc Get all books (with optional filters)
exports.getBooks = async (req, res) => {
  try {
    const { genre, author } = req.query;
    const query = {};
    if (genre) query.genre = genre;
    if (author) query.author = author;

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching books failed", error: err.message });
  }
};

// @desc Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching book failed", error: err.message });
  }
};

// @desc Update book
exports.updateBook = async (req, res) => {
  const { title, author, genre, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Update fields only if provided
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.price = price || book.price;
    book.description = description || book.description;
    if (image) book.image = image; // ✅ Update image only if uploaded

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// @desc Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};
