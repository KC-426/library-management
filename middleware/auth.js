const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");
const messages = require("../utils/messages.js");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const lang = req.lang || "en";

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error();

    req.user = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: messages(lang, "unauthorized") });
  }
};

module.exports = authMiddleware;
