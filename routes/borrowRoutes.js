const express = require("express");

const {
  borrowBook,
  returnBook,
} = require("../controllers/borrowController.js");

const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.route("/borrow/book/:lang").post(authMiddleware, borrowBook);
router.route("/return/book/:bookId/:lang").post(authMiddleware, returnBook);

module.exports = router;
