const express = require("express");
const {
  loginUser,
  signUpUser,
  getUser,
} = require("../controllers/userControllers");
const requireAuth = require("../middlewares/requireAuth");

const app = express.Router();

//Login
app.post("/login", loginUser);

//Signup
app.post("/signup", signUpUser);

//
app.get("/", requireAuth, getUser);

module.exports = app;
