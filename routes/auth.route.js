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
  forgotPassword,
  passwordReset,
  getResetPassword,
  getPasswordReset,
} = require("../controllers/auth.controller");

router.post("/login", loginWithEmail);
router.post("/register", registerWithEmail);
router.get("/register", getRegister);
router.get("/login", getLogin);
router.get("/google", passport.authenticate("google"));
router.get("/login/google", passport.authenticate("google"), loginWithGoogle);
router.get("/logout", getLogout);
router.post("/forgot-password", forgotPassword);
router.post("/password-reset/:token", passwordReset);
router.get("/password-reset/:token", getPasswordReset);
router.get("/forgot-password", getResetPassword);

module.exports = router;
