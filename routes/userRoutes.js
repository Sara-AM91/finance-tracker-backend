const express = require("express");
const {
  loginUser,
  signUpUser,
  getUser,
  editUser,
  changePassword,
  updateProfilePic,
} = require("../controllers/userControllers");
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../services/upload");

const app = express.Router();

//Login
app.post("/login", loginUser);

//Signup
app.post("/signup", signUpUser);

//
app.get("/", requireAuth, getUser);
app.put(
  "/profile/picture",
  requireAuth,
  upload.single("profilePic"),
  updateProfilePic
);
app.put("/profile/password", requireAuth, changePassword);
app.put("/profile/details", requireAuth, editUser);

module.exports = app;
