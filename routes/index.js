const express = require("express");
const router = express.Router();

const messages = require("./message/index.js");

router.use("/messages", messages);

module.exports = router;
