const SECRET = process.env.SECRET;
const Project = require("../models/Project.model.js");
const Task = require("../models/Task.model.js");
const Comment = require("../models/Comment.model.js");
const jwt = require("jsonwebtoken");

const getCurrentUser = (req) => {
  const token = req.cookies.jwt;
  if (token) {
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    return id;
  } else {
    return null;
  }
};

const getProjects = async (req, res) => {
  res.render("../views/tasks/taskManager.ejs");
};

const createProject = async (req, res) => {
  try {
    const title = req.body.title;
    const token = req.cookies.jwt;

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
      console.log(decoded);
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }

    const creator = decoded.id;
    console.log(creator);
    const project = await Project.create({
      title: title,
      creator: creator,
    });
    console.log("Project created");
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProjectList = async (req, res) => {
  try {
    console.log("here");
    const id = jwt.verify(req.cookies.jwt, SECRET).id;
    console.log("get project list function with id : ", id);
    const projectsCreatedByMe = await Project.find({ creator: id });

    const projectsManagedByMe = await Project.find({
      admins: { $in: [id] },
    });
    const otherProjects = await Project.find({
      members: { $in: [id] },
    });

    const projects = [
      ...projectsCreatedByMe,
      ...projectsManagedByMe,
      ...otherProjects,
    ];

    res.status(200).send(projects);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      throw new Error("Project not found");
    }
    const user = getCurrentUser(req);
    if (user != project.creator) {
      throw new Error("You are not authorized to delete this project");
    }
    const tasks = await Task.find({ projectId: req.params.projectId });
    tasks.forEach(async (task) => {
      await Comment.deleteMany({ taskId: task._id });
      await Task.deleteOne({ _id: task._id });
    });
    await Project.deleteOne({ _id: req.params.projectId });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      throw new Error("Project not found");
    }
    const user = getCurrentUser(req);
    if (user != project.creator) {
      throw new Error(
        "You are not authorized to make someone admin of this project"
      );
    }
    const newAdmin = req.body.userId;
    if (project.admins.includes(newAdmin)) {
      throw new Error("User is already an admin of this project");
    }
    console.log("new admin ", newAdmin);
    project.admins.push(newAdmin);
    project.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      throw new Error("Project not found");
    }
    const user = getCurrentUser(req);
    if (user != project.creator && !project.admins.includes(user)) {
      res.status(403).json({
        success: false,
        error: "You are not authorized to add someone to this project",
      });
      throw new Error("You are not authorized to add someone to this project");
    }
    const newMember = req.body.userId;
    if (project.members.includes(newMember)) {
      res.status(403).json({
        success: false,
        error: "User is already a member of this project",
      });
      throw new Error("User is already a member of this project");
    }
    project.members.push(newMember);
    project.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadPDF = async (req, res) => {
  try {
    console.log("ekhane ashse");
    if (!req.file) {
      throw new Error("Please upload a file");
    }
    const pdf = req.file.filename;
    const userId = getCurrentUser(req);
    const project = await Project.findById(req.params.projectId);
    if (project.creator != userId && !project.admins.includes(userId)) {
      throw new Error("You are not authorized to upload a file");
    }
    if (pdf) {
      project.files.push(pdf);
    }
    await project.save();
    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  getProjectList,
  deleteProject,
  addAdmin,
  addMember,
  uploadPDF,
};
