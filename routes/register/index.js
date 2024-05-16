const express = require("express");
const router = express.Router();
const registerUser = require("../../controllers/register/index");

router.route("/")
    .post(registerUser.register);

module.exports = router;