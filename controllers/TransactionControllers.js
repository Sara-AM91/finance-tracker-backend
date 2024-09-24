const Transaction = require("../models/TransactionModel");
const Category = require("../models/CategoryModel");

//HELPER FUNCTION FOR AUTHORIZATION
const checkTransactionOwnership = async (transactionId, userId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new Error("Transaction not found.");
  if (transaction.user.toString() !== userId.toString())
    throw new Error("Unauthorized.");
  return transaction;
};

//GET ALL OF USER WITH FILTER OPTION
const getAllTransactions = async (req, res) => {
  const userId = req.user._id;
  const {
    category,
    type,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    description,
  } = req.query;

  try {
    const filter = { user: userId };

    if (category) {
      filter.category = category;
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate); // Greater than or equal to startDate
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }

    if (minAmount) {
      filter.amount = { ...filter.amount, $gte: Number(minAmount) }; // Greater than or equal to minAmount
    }
    if (maxAmount) {
      filter.amount = { ...filter.amount, $lte: Number(maxAmount) }; // Less than or equal to maxAmount
    }

    if (description) {
      filter.description = { $regex: description, $options: "i" }; // Case-insensitive search
    }

    const transactions = await Transaction.find(filter);

    if (!transactions.length) {
      return res
        .status(200)
        .json({ message: "There are no transactions in database yet." });
    }
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET ONE OF USER
const getOneTransaction = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    await checkTransactionOwnership(id, userId);
    const transaction = await Transaction.findById(id);

    res.status(200).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//EDIT
const editTransaction = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    await checkTransactionOwnership(id, userId);

    const updateTransaction = await Transaction.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    res.status(201).json({
      message: "Transaction successfully updated:",
      updateTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//DELETE
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    await checkTransactionOwnership(id, userId);

    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//CREATE
const createTransaction = async (req, res) => {
  const { title, type, category, date, amount, description } = req.body;
  const imageURL = req.file ? req.file.path : null;
  const userId = req.user._id;
  try {
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found." });
    }

    const transaction = await Transaction.create({
      user: userId,
      title,
      type,
      category,
      date,
      amount,
      description,
      invoice: imageURL,
    });

    await Category.findByIdAndUpdate(category, {
      $push: { transactions: transaction._id },
    });

    res.status(201).json({ message: "New transaction created:", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTransactions,
  getOneTransaction,
  editTransaction,
  deleteTransaction,
  createTransaction,
};
