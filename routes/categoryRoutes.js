const express = require("express");
const app = express.Router();
const {
  getUserCategories,
  createCustomCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoriesByType,
  getGlobalCategories,
} = require("../controllers/categoryControllers");

const { requireAuth } = require("../middlewares/requireAuth");

app
  .route("/")
  .get(requireAuth, getUserCategories)
  .post(requireAuth, createCustomCategory);

app.get("/filter", requireAuth, getCategoriesByType);
app.get("/global", getGlobalCategories);

app
  .route("/:id")
  .put(requireAuth, updateCategoryById)
  .delete(requireAuth, deleteCategoryById);

module.exports = app;
