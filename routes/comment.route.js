const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
router.post("/createComment/:taskId", commentController.createComment);
router.patch("/editComment/:commentId", commentController.editComment);
router.delete("/deleteComment/:commentId", commentController.deleteComment);
router.get("/getComments/:taskId", commentController.getComments);
module.exports = router;
