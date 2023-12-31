const express = require("express");
const router = express.Router();
const { requireAuth, checkUser } = require("../middlewares/auth.middleware");
const projectController = require("../controllers/projects.controller");
console.log(requireAuth);

router.get("/home", (req, res) => {
  res.redirect("/projects");
});
router.get("/projects", projectController.getProjects);
router.post("/creatProject", projectController.createProject);
router.delete("/deleteProject", projectController.deleteProject);
router.patch("/addTask", projectController.addTask);
router.get("/getProject", projectController.getProject);
router.get("/getProjectList", projectController.getProjectList);

module.exports = router;
