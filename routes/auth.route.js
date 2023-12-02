const express = require("express");
const router = express.Router();

const {
  loginWithEmail,
  registerWithEmail,
} = require("../controllers/auth.controller");

router.post("/login", loginWithEmail);
router.post("/register", registerWithEmail);
module.exports = router;
