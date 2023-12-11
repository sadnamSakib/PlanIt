const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  loginWithEmail,
  registerWithEmail,
  getRegister,
  getLogin,
  getLogout,
  loginWithGoogle,
  // getForgotPassword,
  // postForgotPassword,
} = require("../controllers/auth.controller");

router.post("/login", loginWithEmail);
router.post("/register", registerWithEmail);
router.get("/register", getRegister);
router.get("/login", getLogin);
router.get("/google", passport.authenticate("google"));
// router.get("/forgot-password", getForgotPassword);
// router.post("/forgot-password", postForgotPassword);
router.get("/login/google", passport.authenticate("google"), loginWithGoogle);
router.get("/logout", getLogout);

module.exports = router;
