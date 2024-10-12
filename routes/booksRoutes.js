const express = require("express");
const multer = require("multer");
const {
  addBook,
  deleteBookById,
  getAllBooks,
  getBookById,
  updateBook,
} = require("../controllers/booksController.js");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.route("/add/book/:lang").post(upload.single("image"), addBook);
router.route("/fetch/all/books/:lang").get(getAllBooks);
router.route("/get/book/:bookId/:lang").get(getBookById);
router.route("/delete/book/:bookId/:lang").delete(deleteBookById);
router
  .route("/update/book/:bookId/:lang")
  .put(upload.single("image"), updateBook);

module.exports = router;
