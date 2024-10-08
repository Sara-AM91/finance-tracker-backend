const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

CategoryModel.index({ title: 1, categoryType: 1, user: 1 }, { unique: true });
module.exports = mongoose.model("Category", CategoryModel);
