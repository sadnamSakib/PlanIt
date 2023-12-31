const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
  // Add any other fields related to tasks here
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
