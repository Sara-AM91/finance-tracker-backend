const express = require("express");
const {
  loginUser,
  signUpUser,
  getUser,
  editUser,
  changePassword,
  updateProfilePic,
  deactiveAccount,
  addActive,
} = require("../controllers/UserControllers");
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../services/upload");

const app = express.Router();

//Login
app.post("/login", loginUser);

//Signup
app.post("/signup", signUpUser);

//
app.use(requireAuth);
app.get("/", getUser);
app.put(
  "/profile/picture",

  upload.single("profilePic"),
  updateProfilePic
);
app.put("/profile/password", changePassword);
app.put("/profile/details", editUser);
app.put("/profile/deactivate", deactiveAccount);

//add active field in user (set to true)
app.put("/isActive", addActive);

module.exports = app;
