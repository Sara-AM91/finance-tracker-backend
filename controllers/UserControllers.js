const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Sign up user
const signUpUser = async (req, res) => {
  console.log(req.body); // Log to see what is received in the request
  const { name, email, password } = req.body;

  try {
    const user = await User.signup(email, password, name); // Ensure name is passed to the signup method
    const token = createToken(user._id);
    res.status(200).json({ name, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser };
