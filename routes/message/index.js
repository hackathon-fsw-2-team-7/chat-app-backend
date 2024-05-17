const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/message/index.js");
const {authMiddleware} = require("../../middlewares/auth");

router.route("/")
    .get(authMiddleware, messageController.getAllMessages)
    .post(authMiddleware, messageController.addMessage);

module.exports = router;