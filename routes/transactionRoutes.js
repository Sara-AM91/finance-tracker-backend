const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const upload = require("../services/upload");
const app = express.Router();

const {
  getAllTransactions,
  getOneTransaction,
  editTransaction,
  deleteTransaction,
  createTransaction,
} = require("../controllers/TransactionControllers");

app.use(requireAuth);

app
  .route("/")
  .get(getAllTransactions)
  .post(upload.single("invoice"), createTransaction);
app
  .route("/:id")
  .get(getOneTransaction)
  .put(upload.single("invoice"), editTransaction)
  .delete(deleteTransaction);

module.exports = app;
