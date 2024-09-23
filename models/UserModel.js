const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// creating a custom static method
UserModel.statics.signup = async function (email, password, name) {
  //validation

  const exists = await this.findOne({ email });
  console.log("Validating email:", email);
  console.log("Is valid email:", validator.isEmail(email));

  if (exists) {
    throw Error("Email already in use");
  }

  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email.trim())) {
    throw Error("email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Make sure to use at least 8 characters, one upper case letter, a number and a symbol"
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hash });

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
