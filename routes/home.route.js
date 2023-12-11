const express = require("express");
const router = express.Router();
const { requireAuth, checkUser } = require("../middlewares/auth.middleware");
const { getProjects } = require("../controllers/projects.controller");
console.log(requireAuth);

router.get("/home", (req, res) => {
  res.send("Welcome");
});
router.get("/projects", getProjects);

module.exports = router;
