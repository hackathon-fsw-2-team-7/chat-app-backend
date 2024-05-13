const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/message/index.js");

router.route("/")
    .get(messageController.getAllMessages)
    .post(messageController.addMessage);

module.exports = router;