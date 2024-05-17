const express = require("express");
const router = express.Router();
const { editProfile } = require("../../controllers/editProfile/index");
const { authMiddleware } = require("../../middlewares/auth");

router.route("/").patch(authMiddleware(), editProfile);

module.exports = router;
