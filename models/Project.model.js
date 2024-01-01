const mongoose = require("mongoose");
const Task = require("./Task.model.js");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: {
    type: String,
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
  files: [
    {
      type: String,
    },
  ],
  // Add any other fields related to projects here
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
