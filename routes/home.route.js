const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth.middleware");

router.get("/home", ensureAuthenticated, (req, res) => {
  res.send("Welcome");
});

module.exports = router;
