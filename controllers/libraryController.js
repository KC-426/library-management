const librarySchema = require("../models/librarySchema");
const dotenv = require("dotenv");
const messages = require("../utils/messages");
const mongoose = require("mongoose");
const bookSchema = require("../models/booksSchema");

dotenv.config({ path: "config/.env" });

const addLibrary = async (req, res) => {
  const { lang } = req.params;

  try {
    const { name, location, books } = req.body;

    const newLibrary = await librarySchema({
      name,
      location,
      books,
    });

    const libraryData = await newLibrary.save();

    return res
      .status(200)
      .json({ message: messages(lang, "libraryAdded"), libraryData });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const getAllLibraries = async (req, res) => {
  const { lang } = req.params;

  try {
    const libraries = await librarySchema.find();
    if (!libraries || libraries.length === 0) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    return res
      .status(200)
      .json({ message: messages(lang, "librariesFetched"), libraries });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const getLibraryById = async (req, res) => {
  const { libraryId, lang } = req.params;

  try {
    const library = await librarySchema.findById(libraryId).populate({
      path: "books",
      populate: {
        path: "borrowerId",
        select: "name email",
      },
    });
    if (!library) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    return res
      .status(200)
      .json({ message: messages(lang, "libraryFetched"), library });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const deleteLibraryById = async (req, res) => {
  const { libraryId, lang } = req.params;

  try {
    const library = await librarySchema.findById(libraryId);
    if (!library) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    await librarySchema.findByIdAndDelete(libraryId);

    return res.status(200).json({ message: messages(lang, "libraryDeleted") });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const updateLibrary = async (req, res) => {
  const { libraryId, lang } = req.params;

  try {
    const updatedData = req.body;

    const library = await librarySchema.findById(libraryId);
    if (!library) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    library.name = updatedData.name || library.name;
    library.location = updatedData.location || library.location;

    if (Array.isArray(updatedData.books)) {
      library.books = updatedData.books.map(
        (bookId) => new mongoose.Types.ObjectId(bookId)
      );
    }

    await library.save();

    return res
      .status(200)
      .json({ message: messages(lang, "libraryUpdated"), library });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

//////////////////////////////       LIBRARY INVENTORY       /////////////////////////////////

const addBookToLibraryInventory = async (req, res) => {
  const { libraryId, lang } = req.params;
  const { bookId } = req.body;

  try {
    const library = await librarySchema.findById(libraryId);
    if (!library) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    const book = await bookSchema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    if (library.books.includes(bookId)) {
      return res.status(400).json({ message: messages(lang, "bookInLibrary") });
    }

    library.books.push(book._id);
    book.libraryId = library._id;

    await library.save();
    await book.save();

    return res
      .status(200)
      .json({ message: messages(lang, "bookAdded"), library });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const removeBookFromLibraryInventory = async (req, res) => {
  const { libraryId, bookId, lang } = req.params;

  try {
    const library = await librarySchema.findById(libraryId);
    if (!library) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    const book = await bookSchema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    if (!library.books.includes(bookId)) {
      return res
        .status(400)
        .json({ message: messages(lang, "bookNotInLibrary") });
    }

    library.books = library.books.filter((id) => id.toString() !== bookId);
    await library.save();

    return res
      .status(200)
      .json({ message: messages(lang, "bookDeleted"), library });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const booksListInLibraryInventory = async (req, res) => {
  const { libraryId, lang } = req.params;

  try {
    const library = await librarySchema.findById(libraryId).populate("books");
    if (!library) {
      return res
        .status(404)
        .json({ message: messages(lang, "libraryNotFound") });
    }

    const booksList = library.books;

    return res
      .status(200)
      .json({ message: messages(lang, "booksFetched"), booksList });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

module.exports = {
  addLibrary,
  getAllLibraries,
  getLibraryById,
  deleteLibraryById,
  updateLibrary,
  addBookToLibraryInventory,
  removeBookFromLibraryInventory,
  booksListInLibraryInventory,
};
