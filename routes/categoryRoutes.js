const express = require("express");
const app = express.Router();
const {
  getUserCategories,
  createCustomCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoriesByType,
} = require("../controllers/categoryControllers");

const { requireAuth } = require("../middlewares/requireAuth");

app
  .route("/")
  .get(requireAuth, getUserCategories)
  .post(requireAuth, createCustomCategory);

app.route("/filter").get(getCategoriesByType);

app
  .route("/:id")
  .put(requireAuth, updateCategoryById)
  .delete(requireAuth, deleteCategoryById);

module.exports = app;
