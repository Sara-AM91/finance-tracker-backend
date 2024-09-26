const Category = require("../models/CategoryModel");

//Fetch categories (global + user-specific)
const getUserCategories = async (req, res) => {
  const userId = req.user._id;

  try {
    const categories = await Category.find({
      $or: [{ user: null }, { user: userId }],
    }).sort({ title: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve categories. Please try again later.",
    });
  }
};

const createCustomCategory = async (req, res) => {
  const userId = req.user._id;
  const { title, categoryType, description } = req.body;

  const category = new Category({
    title,
    categoryType,
    description,
    user: userId,
  });

  try {
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        error:
          "Category title already exists. Please choose a different title.",
      });
    } else {
      res
        .status(500)
        .json({ error: "Failed to create category. Please try again later." });
    }
  }
};
const updateCategoryById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found or unauthorized access." });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update category. Please check the data and try again.",
    });
  }
};

const deleteCategoryById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const category = await Category.findOneAndDelete({ _id: id, user: userId });

    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found or unauthorized access." });
    }

    res.status(204).end();
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to delete category. Please try again later." });
  }
};

module.exports = {
  getUserCategories,
  createCustomCategory,
  updateCategoryById,
  deleteCategoryById,
};
