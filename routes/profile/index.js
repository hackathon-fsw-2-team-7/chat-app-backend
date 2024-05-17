const express = require("express");
const router = express.Router();
const { profile } = require("../../controllers/profile/index");
const { authMiddleware } = require("../../middlewares/auth");

router.route("/").get(authMiddleware(), profile);

module.exports = router;
