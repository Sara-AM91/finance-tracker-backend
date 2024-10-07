const mongoose = require("mongoose");
const Category = require("./models/CategoryModel");
const dotenv = require("dotenv");

dotenv.config();

//Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Define the icons based on the category titles
const iconMapping = {
  Educations: "educations.png",
  "Groceries & Food": "food.png",
  "Child Support": "child-support.png",
  Shopping: "shopping.png",
  Entertainment: "entertainment.png",
  Healthcare: "healthcare.png",
  Rent: "rent.png",
  Salary: "salary.png",
  Gifts: "gift.png",
  Freelance: "freelancer.png",
  Interest: "interest.png",
  Investments: "investments.png",
  "Social Security": "social-security.png",
  Pension: "pension.png",
  Transportation: "transportation.png",
  "Utilities & Bills": "utilities.png",
  Interest: "interest.png",
  "Stock Sales": "stock-sales.png",
  Other: "other.png",
};

//Function to update each category with its corresponding icon
const updateCategories = async () => {
  try {
    for (const [title, icon] of Object.entries(iconMapping)) {
      //Update the category with the corresponding icon based on the title
      const result = await Category.updateMany({ title }, { $set: { icon } });

      console.log(`Updated category "${title}" with icon "${icon}":`, result);
    }
    console.log("All categories updated successfully!");
  } catch (error) {
    console.error("Error updating categories:", error);
  } finally {
    mongoose.disconnect();
  }
};

//Execute the update function
updateCategories();
