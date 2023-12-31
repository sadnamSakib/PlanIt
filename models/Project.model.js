const mongoose = require("mongoose");
const Task = require("./Task.model.js");

const projectSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tasks: [Task.schema],
  // Add any other fields related to projects here
});

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
