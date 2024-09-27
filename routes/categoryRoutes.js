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

const requireAuth = require("../middlewares/requireAuth");

app.get("/global", getGlobalCategories);

app.use(requireAuth);

app.route("/").get(getUserCategories).post(createCustomCategory);

app.get("/filter", getCategoriesByType);

app.route("/:id").put(updateCategoryById).delete(deleteCategoryById);

module.exports = app;
