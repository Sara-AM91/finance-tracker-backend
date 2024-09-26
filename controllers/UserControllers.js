const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

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

//EDIT USER DETAILS
const editUser = async (req, res) => {
  const userId = req.user._id;
  const { firstName, lastName, email } = req.body;

  try {
    const existingMail = await User.findOne({ email, _id: { $ne: userId } }); // Exclude current user
    if (existingMail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User details successfully updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//UPDATE PROFILE PICTURE
const updateProfilePic = async (req, res) => {
  const userId = req.user._id;
  const profilePic = req.file ? req.file.path : null;

  if (!profilePic) {
    return res.status(400).json({ error: "No profile picture provided" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User profile picture updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//CONTROL PASSWORD
const isPasswordCorrect = async (userId, currentPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new Error("Incorrect current password");
  }
};

//CHANGE PASSWORD
const changePassword = async (req, res) => {
  const userId = req.user._id;
  //compare existing password to the one provided by user, the compare the password to its repetition and validate its strength
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Passwords don´t match" });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters, include a number, uppercase letter, and special character",
      });
    }

    await isPasswordCorrect(userId, currentPassword);

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password succesfully changed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signUpUser,
  getUser,
  editUser,
  changePassword,
  updateProfilePic,
};
