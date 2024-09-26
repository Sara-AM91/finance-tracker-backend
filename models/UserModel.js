const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// Custom Error Classes for better error handling
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400; //Bad request
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401; //Unauthorized
  }
}

const UserModel = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePic: {
    type: String,
  },
});

//Creating a custom static method
UserModel.statics.signup = async function (
  firstName,
  lastName,
  email,
  password
) {
  //Check if all fields are provided
  if (!firstName || !lastName || !email || !password) {
    throw new ValidationError("All fields must be filled");
  }

  //Check if the email is already registered
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already exists");
  }

  //Validate required fields
  if (!firstName || !lastName || !email || !password) {
    throw Error("All fields must be filled");
  }

  //Validate email format
  if (!validator.isEmail(email.trim())) {
    throw new ValidationError("Invalid email address");
  }

  //Validate password strength
  if (!validator.isStrongPassword(password)) {
    throw new ValidationError(
      "Password must be at least 8 characters long, include a number, uppercase letter, and a special character"
    );
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  return user;
};

//Custom static login method
UserModel.statics.login = async function (email, password) {
  //Check if both email and password are provided
  if (!email || !password) {
    throw Error("Both email and password are required");
  }

  //Check if the user exists
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  //Compare the provided password with the hashed password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AuthError("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", UserModel);
