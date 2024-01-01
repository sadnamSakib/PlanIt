const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const fileMiddleWare = require("../middlewares/files.middleware");

router.get("/profile", profileController.getProfile);
router.patch("/profile/updateProfile", profileController.updateProfile);
router.patch("/profile/password", profileController.changePassword);
router.delete("/profile/deleteprofile", profileController.deleteProfile);
router.patch(
  "/profile/updateProfilePicture",
  fileMiddleWare.uploadImage.single("profileImage"),
  profileController.updateProfilePicture
);

module.exports = router;
