const crypto = require("crypto");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 40,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log("Reset Password Token:", resetToken);
  return resetToken;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
