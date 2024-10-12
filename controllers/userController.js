const userSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const messages = require("../utils/messages");

dotenv.config({ path: "config/.env" });

const userSignup = async (req, res) => {
  const { lang } = req.params;

  try {
    const { name, email, password, role } = req.body;

    const user = await userSchema.findOne({ email });
    if (user) {
      return res.status(400).json({ message: messages(lang, "userExist") });
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const newUser = new userSchema({
      name,
      email,
      password: hashedPwd,
      role,
    });

    const userData = await newUser.save();

    return res
      .status(200)
      .json({ message: messages(lang, "userSignup"), userData });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

const userLogin = async (req, res) => {
  const { lang } = req.params;

  try {
    const { email, password, role } = req.body;

    const user = await userSchema.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: messages(lang, "userNotFound") });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: messages(lang, "invalidPassword") });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ message: messages(lang, "loginSuccess"), token });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: messages(lang, "internalServerError") });
  }
};

module.exports = {
  userSignup,
  userLogin,
};
