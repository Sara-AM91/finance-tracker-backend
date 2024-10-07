const Transaction = require("../models/TransactionModel");
const Category = require("../models/CategoryModel");

//HELPER FUNCTION FOR AUTHORIZATION
//only owner can access and modify transactions
const checkTransactionOwnership = async (transactionId, userId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new Error("Transaction not found.");

  // Check if the transaction belongs to the logged-in user
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
    createdDate,
  } = req.query;

  try {
    console.log("Received query parameters:", req.query);
    const filter = { user: userId }; // Only fetch transactions belonging to the user

    // Handle createdDate filter
    if (createdDate && createdDate !== "undefined") {
      console.log("Filtering by Created Date:", createdDate);

      // Create a start and end time for the given day
      const startOfDay = new Date(createdDate);
      startOfDay.setHours(0, 0, 0, 0); // Set start time to 00:00:00
      const endOfDay = new Date(createdDate);
      endOfDay.setHours(23, 59, 59, 999); // Set end time to 23:59:59

      // Use `createdAt` field for filtering in the date range
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    console.log("Final Filter Object:", filter); // Log the filter object

    // Apply category filter if provided
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
      filter.amount = { ...filter.amount, $gte: Number(minAmount) };
    }
    if (maxAmount) {
      filter.amount = { ...filter.amount, $lte: Number(maxAmount) };
    }

    if (description) {
      filter.description = { $regex: description, $options: "i" };
    }

    // Fetch transactions based on the constructed filter
    const transactions = await Transaction.find(filter).populate(
      "category",
      "title icon"
    );

    if (!transactions.length) {
      return res.status(200).json({ message: "No transactions found." });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error); // Log detailed error
    res.status(500).json({ error: error.message });
  }
};

//GET ONE OF USER
const getOneTransaction = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    await checkTransactionOwnership(id, userId);
    const transaction = await Transaction.findById(id).populate(
      "category",
      "title icon"
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//EDIT A TRANSACTION
const editTransaction = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    await checkTransactionOwnership(id, userId); // Check ownership

    // Update transaction fields
    const updateData = { ...req.body };

    // Handle file upload (invoice), update only if a new file is provided
    if (req.file) {
      updateData.invoice = req.file.path;
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("category", "title icon");

    res.status(200).json({
      message: "Transaction successfully updated:",
      updatedTransaction,
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

    const transaction = await checkTransactionOwnership(id, userId);

    await Category.findByIdAndUpdate(transaction.category, {
      $pull: { transactions: transaction._id },
    });

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

    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be greater than zero." });
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
