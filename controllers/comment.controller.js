const Comment = require("../models/Comment.model.js");
const Task = require("../models/Task.model.js");
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
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const user = getCurrentUser(req);
    const text = req.body.text;
    if (task.assignedTo.includes(user) || task.creator == user) {
      const comment = await Comment.create({
        text: text,
        creator: user,
        taskId: task._id,
      });
      res.status(200).json(comment);
    } else {
      throw new Error("You are not authorized to comment on this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const editComment = async (req, res) => {
  try {
    const user = getCurrentUser(req);
    const comment = await Comment.findById(req.params.commentId);
    if (comment.creator == user) {
      comment.text = req.body.comment;
      await comment.save();
      res.status(200).json(comment);
    } else {
      throw new Error("You are not authorized to comment on this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const user = getCurrentUser(req);
    const comment = await Comment.findById(req.params.commentId);
    if (comment.creator == user) {
      await Comment.deleteOne({ _id: req.params.commentId });
      res.status(200).json({ success: true });
    } else {
      throw new Error("You are not authorized to comment on this task");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createComment,
  editComment,
  deleteComment,
  getComments,
};
