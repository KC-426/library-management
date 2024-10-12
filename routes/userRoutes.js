const express = require("express");
const { userSignup, userLogin } = require("../controllers/userController.js");

const router = express.Router();

router.route("/user/signup/:lang").post(userSignup);
router.route("/user/login/:lang").post(userLogin);

module.exports = router;
