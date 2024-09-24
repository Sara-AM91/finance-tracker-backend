const express = require("express");
const upload = require("../services/upload");
const api = express.Router();

const {
  getAllTransactions,
  getOneTransaction,
  editTransaction,
  deleteTransaction,
  createTransaction,
} = require("../controllers/TransactionControllers");

api
  .route("/")
  .get(getAllTransactions)
  .post(upload.single("invoice"), createTransaction);
api
  .route("/:id")
  .get(getOneTransaction)
  .put(upload.single("invoice"), editTransaction)
  .delete(deleteTransaction);

module.exports = api;
