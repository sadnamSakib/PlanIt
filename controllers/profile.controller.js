const User = require("../models/User.model");
const Project = require("../models/Project.model");
const Comment = require("../models/Comment.model");
const Task = require("../models/Task.model");
const bcrypt = require("bcrypt");
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const isValidPassword = (password) => {
  if (password.length < 8) {
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  return passwordRegex.test(password);
};

const getCurrentUser = (req) => {
  const token = req.cookies.jwt;
  if (token) {
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    return id;
  } else {
    return null;
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Please upload a file");
    }
    const photo = req.file.filename;
    const userId = getCurrentUser(req);

    const user = await User.findOne({ _id: userId });
    if (photo) {
      user.profileImage = photo;
    }
    await user.save();
    res.json({ message: "Profile image updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    const user = await User.findById(id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    const user = await User.findById(id);
    if (req.body.password != req.body.confirmPassword) {
      res.status(400).send("passwords do not match");
    } else if (!isValidPassword(req.body.password)) {
      throw new Error("Invalid Password");
    }
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).send("password changed");
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    const user = await User.findById(id);
    if (user) {
      user.username = req.body.username;
      user.save();
      res.status(200).send("profile updated");
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(getCurrentUser(req));
    if (!user) {
      throw new Error("User not found");
    }
    const projects = await Project.findMany({ creator: user._id });
    projects.forEach(async (project) => {
      const tasks = await Task.findMany({ projectId: project._id });
      tasks.forEach(async (task) => {
        await Comment.deleteMany({ taskId: task._id });
      });
      await Task.deleteMany({ projectId: project._id });
    });
    await Project.deleteMany({ creator: user._id });
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("connect.sid", "", { maxAge: 1 });
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProfile,
  changePassword,
  updateProfile,
  deleteProfile,
  updateProfilePicture,
};
