const mongoose = require("mongoose");

const TransactionModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //Each transaction is linked to one user (user: { ref: 'User' }).
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be at least 0.01"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, //Each transaction is also linked to a category (category: { ref: 'Category' }).
    ref: "Category",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    maxlength: 500,
  },
});

module.exports = mongoose.Model("Transaction", TransactionModel);
