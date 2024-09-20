// Assuming `userId` is the current user's _id
const getUserCategories = async (userId) => {
  //get the userId from req.body not as a parameter
  const categories = await Category.find({
    $or: [
      { user: null }, // Global categories
      { user: userId }, // User's custom categories
    ],
  }).sort({ name: 1 }); // Optional: Sort alphabetically

  return categories;
};

//modify it and get the userId and categoryData from req.body
const createCustomCategory = async (userId, categoryData) => {
  const { name, categoryType, description } = categoryData;

  const category = new Category({
    name,
    categoryType,
    description,
    user: userId, // Assign the category to the user
  });

  try {
    await category.save();
    return category;
  } catch (error) {
    // Handle duplicate key error (e.g., category name already exists for the user)
    if (error.code === 11000) {
      throw new Error("Category name already exists.");
    }
    throw error;
  }
};
