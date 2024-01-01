const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projects.controller");
const fileMiddleWare = require("../middlewares/files.middleware");

router.get("/projects", projectController.getProjects);
router.post("/createProject", projectController.createProject);
router.delete("/deleteProject/:projectId", projectController.deleteProject);
router.get("/getProject/:projectId", projectController.getProject);
router.get("/getProjectList", projectController.getProjectList);
router.patch("/addAdmin/:projectId", projectController.addAdmin);
router.patch("/addMember/:projectId", projectController.addMember);
router.patch(
  "/uploadPdf/:projectId",
  fileMiddleWare.uploadPdf.single("pdf"),
  projectController.uploadPDF
);

module.exports = router;
