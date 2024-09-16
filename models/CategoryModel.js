const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  //Expenses Categories:Transportation,Educations, ... and Income Categories:Freelance,Investments,...
  categoryType: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", CategoryModel);
