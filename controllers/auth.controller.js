const crypto = require("crypto");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  if (password.length < 8) {
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  return passwordRegex.test(password);
};

const registerWithEmail = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    if (!isValidEmail(email)) {
      throw new Error("Invalid Email");
    }
    if (!isValidPassword(password)) {
      throw new Error("Invalid Password");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).redirect("/login");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!isValidEmail(email)) {
      throw new Error("Invalid Email");
    }
    if (!isValidPassword(password)) {
      throw new Error("Invalid Password");
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.password) {
      throw new Error("Invalid Sign in attempt");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).redirect("/projects");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const token = createToken(req.user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).redirect("/projects");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLogin = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    res.redirect("/projects");
  } else {
    res.render("../views/auth/login");
  }
};
const getRegister = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    res.redirect("/projects");
  } else {
    res.render("../views/auth/register");
  }
};
const getForgotPassword = async (req, res) => {
  res.render("../views/auth/forgotPassword");
};
const getLogout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });
  res.redirect("/login");
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Error("User not found"));
  }
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/password-reset/${resetToken}`;
  console.log(resetURL);
  res.send(resetURL);
};

const passwordReset = async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new Error("Invalid Token"));
    }
    if (!isValidPassword(req.body.password)) {
      return next(new Error("Invalid Password"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.redirect("/login");
  } catch (err) {
    return next(err);
  }
};

const getResetPassword = async (req, res) => {
  res.render("../views/auth/forgotPassword");
};
const getPasswordReset = async (req, res) => {
  res.render("../views/auth/resetPassword", { token: req.params.token });
};

module.exports = {
  isValidEmail: isValidEmail,
  isValidPassword: isValidPassword,
  registerWithEmail: registerWithEmail,
  loginWithEmail: loginWithEmail,
  getLogin: getLogin,
  getRegister: getRegister,
  getLogout: getLogout,
  loginWithGoogle: loginWithGoogle,
  forgotPassword: forgotPassword,
  passwordReset: passwordReset,
  getResetPassword: getResetPassword,
  getPasswordReset: getPasswordReset,
};
