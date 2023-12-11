const getProjects = async (req, res) => {
  res.render("../views/tasks/taskManager.ejs");
};

module.exports = {
  getProjects,
};
