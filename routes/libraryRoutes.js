const express = require("express");
const {
  addBookToLibraryInventory,
  addLibrary,
  booksListInLibraryInventory,
  deleteLibraryById,
  getAllLibraries,
  getLibraryById,
  removeBookFromLibraryInventory,
  updateLibrary,
} = require("../controllers/libraryController.js");

const router = express.Router();

router.route("/add/library/:lang").post(addLibrary);
router.route("/fetch/all/libraries/:lang").get(getAllLibraries);
router.route("/get/library/:libraryId/:lang").get(getLibraryById);
router.route("/delete/library/:libraryId/:lang").delete(deleteLibraryById);
router.route("/update/library/:libraryId/:lang").put(updateLibrary);

//////////////////////////////       LIBRARY INVENTORY       /////////////////////////////////

router
  .route("/add-book-to-library-inventory/:libraryId/:lang")
  .post(addBookToLibraryInventory);
router
  .route("/remove-book-from-library-inventory/:libraryId/:bookId/:lang")
  .delete(removeBookFromLibraryInventory);
router
  .route("/fetch-books-list-from-library-inventory/:libraryId/:lang")
  .get(booksListInLibraryInventory);

module.exports = router;
