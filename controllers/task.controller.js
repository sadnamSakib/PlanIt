const Project = require("../models/Project.model.js");
const Task = require("../models/Task.model.js");
const Comment = require("../models/Comment.model.js");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const getCurrentUser = (req) => {
  const token = req.cookies.jwt;
  if (token) {
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    return id;
  } else {
    return null;
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const user = getCurrentUser(req);
    const title = req.body.title;
    if (project.admins.includes(user) || project.creator === user) {
      const task = await Task.create({
        title: title,
        creator: user,
        projectId: req.params.projectId,
        description: req.body.description,
      });
      res.status(201).json(task);
    } else {
      throw new Error("You are not authorized to add task to this project");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const user = getCurrentUser(req);
    const assignedTo = req.body.assignedTo;
    console.log(task.creator, user);
    if (task.creator == user) {
      task.assignedTo.push(assignedTo);
      await task.save();
      res.status(200).json({ success: true });
    } else {
      throw new Error("You are not authorized to assign this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateDeadLine = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const user = getCurrentUser(req);
    const daysRemaining = req.body.daysRemaining;
    if (task.creator == user) {
      task.deadline = Date.now() + daysRemaining * 24 * 60 * 60 * 1000;
      await task.save();
      res.status(200).json({ success: true });
    } else {
      throw new Error("You are not authorized to update this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateDescription = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const user = getCurrentUser(req);
    const description = req.body.description;
    if (task.creator == user) {
      task.description = description;
      await task.save();
      res.status(200).json({ success: true });
    } else {
      res.status(403).json({
        success: false,
        error: "You are not authorized to update this task",
      });
      throw new Error("You are not authorized to update this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const user = getCurrentUser(req);
    if (task.creator == user) {
      await Comment.deleteMany({ taskId: task._id });
      await Task.deleteOne({ _id: task._id });
      res.status(200).json({ success: true });
    } else {
      throw new Error("You are not authorized to delete this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTask,
  assignTask,
  updateDeadLine,
  updateDescription,
  deleteTask,
  getTasks,
  getTask,
};
