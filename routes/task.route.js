const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
router.post("/createTask/:projectId", taskController.createTask);
router.patch("/assignTask/:taskId", taskController.assignTask);
router.patch("/updateDeadLine/:taskId", taskController.updateDeadLine);
router.patch("/updateDescription/:taskId", taskController.updateDescription);
router.delete("/deleteTask/:taskId", taskController.deleteTask);
router.get("/getTasks/:projectId", taskController.getTasks);
router.get("/getTask/:taskId", taskController.getTask);

module.exports = router;
