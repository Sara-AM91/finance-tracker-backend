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
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.signup(firstName, lastName, email, password);
    const token = createToken(user._id);

    res.status(200).json({ firstName, lastName, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//GET USER BY ID
const getUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//EDIT USER
const editUser = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(201)
      .json({ message: "User details successfully updated:", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser, getUser, editUser };
