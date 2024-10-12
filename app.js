const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config({ path: "config/.env" });

const PORT = process.env.PORT;
const { MONGODB_URI } = process.env;

app.use(express.json());

const userRoutes = require("./routes/userRoutes.js");
const libraryRoutes = require("./routes/libraryRoutes.js");
const bookRoutes = require("./routes/booksRoutes.js");
const borrowRoutes = require("./routes/borrowRoutes.js");

app.use("/api/v1", userRoutes);
app.use("/api/v1", libraryRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", borrowRoutes);

app.use("/", (req, res) => {
  console.log("Working ");
  res.send("WORKING");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("DB Connected !");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
