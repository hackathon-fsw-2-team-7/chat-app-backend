const express = require("express");
const router = express.Router();

const messages = require("./message/index.js");
const auth = require("./auth/index.js");

router.use("/messages", messages);
router.use("/auth", auth);

module.exports = router;
