const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
    res.status(201).json({ user: user._id });
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }
    res.status(200).json({ user: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  isValidEmail: isValidEmail,
  isValidPassword: isValidPassword,
  registerWithEmail: registerWithEmail,
  loginWithEmail: loginWithEmail,
};
