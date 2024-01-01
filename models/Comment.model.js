const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  creationTime: {
    type: Date,
    default: Date.now,
  },
});
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
