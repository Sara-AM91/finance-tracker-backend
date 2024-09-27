const Category = require("../models/CategoryModel");

const getCategoriesByType = async (req, res) => {
  const { categoryType } = req.query;
  const userId = req.user ? req.user._id : null;

  try {
    //Fetch both global categories (user: null) and user-specific categories (user: userId)
    const query = {
      categoryType,
      $or: [{ user: null }, { user: userId }],
    };

    const categories = await Category.find(query).sort({ title: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGlobalCategories = async (req, res) => {
  const { categoryType } = req.query;
  try {
    const categories = await Category.find({
      categoryType,
      user: null,
    }).sort({ title: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
  const userId = req.user ? req.user._id : null;
  const { title, categoryType, description, user } = req.body;
  const categoryData = {
    title,
    categoryType,
    description,
    user: user === null ? null : userId,
  };

  const category = new Category(categoryData);

  try {
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Category name already exists." });
    } else {
      res.status(500).json({ error: error.message });
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
  getCategoriesByType,
  getGlobalCategories,
};
