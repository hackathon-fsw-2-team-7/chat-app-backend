const express = require("express");
const router = express.Router();
const { deleteUser } = require("../../controllers/deleteUser/index");
const { authMiddleware } = require("../../middlewares/auth");

router.route("/").delete(authMiddleware(), deleteUser);

module.exports = router;
