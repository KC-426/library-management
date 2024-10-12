const bookSchema = require("../models/booksSchema.js");
const dotenv = require("dotenv");
const {
  deleteImageFromFirebaseStorage,
  uploadBookImageToFirebaseStorage,
} = require("../utils/helperFuncitions.js");
const messages = require("../utils/messages.js");

dotenv.config({ path: "config/.env" });

const addBook = async (req, res) => {
  const { lang } = req.params;
  try {
    const { title, authorId } = req.body;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: messages(lang, "bookNotFound") });
    }

    const imageUrl = await uploadBookImageToFirebaseStorage(req, res);

    const newBook = new bookSchema({
      title,
      authorId,
      image: imageUrl,
    });

    const bookData = await newBook.save();

    return res
      .status(200)
      .json({ message: messages(lang, "bookAdded"), bookData });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const getAllBooks = async (req, res) => {
  const { lang } = req.params;

  try {
    const books = await bookSchema.find();

    if (!books || books.length === 0) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    return res
      .status(200)
      .json({ message: messages(lang, "booksFetched"), books });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const getBookById = async (req, res) => {
  const { bookId, lang } = req.params;
  try {
    const book = await bookSchema
      .findById(bookId)
      .populate("authorId", "name email")
      .populate("borrowerId", "name email")
      .populate("libraryId", "name location");

    if (!book) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    return res
      .status(200)
      .json({ message: messages(lang, "bookFetched"), book });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const deleteBookById = async (req, res) => {
  const { bookId, lang } = req.params;
  try {
    const book = await bookSchema.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    if (book.image && book.image.url) {
      await deleteImageFromFirebaseStorage(book.image.url);
    }

    await bookSchema.findByIdAndDelete(bookId);

    return res.status(200).json({ message: messages(lang, "bookDeleted") });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const updateBook = async (req, res) => {
  const { bookId, lang } = req.params;

  try {
    const updatedData = req.body;

    const book = await bookSchema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    if (req.file) {
      if (book.image && book.image.url) {
        try {
          await deleteImageFromFirebaseStorage(book.image.path);
        } catch (err) {
          console.log("Error deleting old image:", err.message);
        }
      }

      const imageUrl = await uploadBookImageToFirebaseStorage(req, res);
      book.image = imageUrl;
    }

    book.title = updatedData.title || book.title;
    book.authorId = updatedData.authorId || book.authorId;

    await book.save();

    return res
      .status(200)
      .json({ message: messages(lang, "bookUpdated"), book });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  deleteBookById,
  updateBook,
};
