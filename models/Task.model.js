const mongoose = require("mongoose");
const Comment = require("./Comment.model.js");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
