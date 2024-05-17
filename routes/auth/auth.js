const express = require("express");
const router = express.Router();
const { googleLogin } = require("../../controllers/register/auth");

router.post("/google-login", googleLogin);

module.exports = router;
