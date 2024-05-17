const express = require("express");
const router = express.Router();

const registerUser = require("../../controllers/register/index");
const { login, googleLogin } = require("../../controllers/auth/index.js");
const { profile } = require("../../controllers/profile/index");
const { authMiddleware } = require("../../middlewares/auth");

router
  .post("/login", login)
  .post("/google-login", googleLogin)
  .post("/register", registerUser.register)
  .post("/profile", authMiddleware, profile);

module.exports = router;
