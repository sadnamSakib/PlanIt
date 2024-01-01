const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.route");
const projectRoutes = require("./routes/project.route");
const commentRoutes = require("./routes/comment.route");
const profileRoutes = require("./routes/profile.route");
const taskRoutes = require("./routes/task.route");
const passportSetup = require("./config/passport");
const { requireAuth, checkUser } = require("./middlewares/auth.middleware");

app.use(cors()); // Add this if needed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/css", express.static("./node_modules/bootstrap/dist/css"));
app.use("/js", express.static("./node_modules/bootstrap/dist/js"));
app.use("/js", express.static("./node_modules/jquery/dist"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("*", checkUser);
app.use(authRoutes);
app.use(requireAuth);
app.use(projectRoutes);
app.use(commentRoutes);
app.use(profileRoutes);
app.use(taskRoutes);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = app;
