const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserModel = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
  },
});

// creating a custom static method
UserModel.statics.signup = async function (
  firstName,
  lastName,
  email,
  password
) {
  const exists = await this.findOne({ email });
  console.log("Validating email:", email);
  console.log("Is valid email:", validator.isEmail(email));

  if (exists) {
    throw Error("Email already exists");
  }

  //Validate required fields
  if (!firstName || !lastName || !email || !password) {
    throw Error("All fields must be filled");
  }

  //Validate email
  if (!validator.isEmail(email.trim())) {
    throw Error("Email is not valid");
  }

  //Validate password strength
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be at least 8 characters, include a number, uppercase letter, and a special character"
    );
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create user
  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
  });
  return user;
};

//static custom login method
UserModel.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", UserModel);
