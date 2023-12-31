const Project = require("../models/Project.model.js");
const getProjects = async (req, res) => {
  res.render("../views/tasks/taskManager.ejs");
};

const createProject = async (req, res) => {
  try {
    const { creator, members, tasks } = req.body;
    const admins = [];

    // Create a new project instance
    const project = new Project({
      creator,
      admins,
      members,
      tasks,
    });

    // Save the project to the database
    await project.save();

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProjectList = async (req, res) => {
  try {
    const projectsCreatedByMe = await Project.find({ creator: req.body.id });
    const projectsManagedByMe = await Project.find({
      admins: { $in: [req.body.id] },
    });
    const otherProjects = await Project.find({
      members: { $in: [req.body.id] },
    });

    res.status(200).json({
      success: true,
      projectsCreatedByMe: projectsCreatedByMe,
      otherProjects: otherProjects,
      projectsManagedByMe: projectsManagedByMe,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne(req.body.id);
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const addTask = async (req, res) => {
  try {
    const project = await Project.findOne(req.body.id);
    project.tasks.push(req.body.task);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne(req.body.id);
    if (req.body.creator != project.creator) {
      res
        .status(403)
        .json({
          success: false,
          error: "You are not authorized to delete this project",
        });
      throw new Error("You are not authorized to delete this project");
    }
    project.remove();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  getProjectList,
  addTask,
  deleteProject,
};
