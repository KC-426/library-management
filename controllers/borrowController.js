const bookSchema = require("../models/booksSchema.js");
const userSchema = require("../models/userSchema.js");
const messages = require("../utils/messages.js");

const borrowBook = async (req, res) => {
  const { lang } = req.params;

  const { bookId, charge } = req.body;
  const userId = req.user;
  const userRole = req.userRole;

  try {
    if (userRole !== "Borrower") {
      return res
        .status(403)
        .json({ message: messages(lang, "borrowerBorrowBook") });
    }

    const book = await bookSchema.findById(bookId);

    if (!book) {
      return res
        .status(400)
        .json({ message: messages(lang, "bookNotAvailable") });
    }
    if (book.isBorrowed) {
      return res
        .status(400)
        .json({ message: messages(lang, "bookAlreadyBorrowed") });
    }

    book.isBorrowed = true;
    book.borrowerId = userId;
    book.charge = charge;

    await book.save();

    await userSchema.findByIdAndUpdate(userId, {
      $push: { borrowedBooks: book._id },
    });

    return res
      .status(200)
      .json({ message: messages(lang, "bookBorrowed"), book });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const returnBook = async (req, res) => {
  const userId = req.user?.toString();
  const userRole = req.userRole;
  const { bookId, lang } = req.params;

  try {
    if (userRole !== "Borrower") {
      return res.status(403).json({ message: messages(lang, "borrowerReturnBook") });
    }

    const book = await bookSchema.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: messages(lang, "bookNotFound") });
    }

    if (!book.isBorrowed || book.borrowerId.toString() !== userId) {
      return res.status(400).json({ message: messages(lang, "notBorrowedBook") });
    }

    book.isBorrowed = false;
    book.borrowerId = null;
    book.charge = null;

    await book.save();

    await userSchema.findByIdAndUpdate(userId, {
      $pull: { borrowedBooks: book._id },
    });

    return res.status(200).json({ message: messages(lang, "bookReturn") });
  } catch (err) {
    console.error("Error in returnBook:", err);
    return res.status(500).json({ message: messages(lang, "internalServerError") });
  }
};


module.exports = {
  borrowBook,
  returnBook,
};
