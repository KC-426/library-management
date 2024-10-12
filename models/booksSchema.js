const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Library",
    },
    image: {
      name: {
        type: String,
      },
      path: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    charge: {
      type: String,
    },
    isBorrowed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
