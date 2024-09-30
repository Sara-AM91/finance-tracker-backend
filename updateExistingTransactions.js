const mongoose = require("mongoose");
const TransactionModel = require("./models/TransactionModel"); // Update this to your path
const dotenv = require("dotenv");

dotenv.config();

//Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateExistingTransactions = async () => {
  try {
    //Update all transactions to include createdAt and updatedAt fields
    const result = await TransactionModel.updateMany(
      { createdAt: { $exists: false } }, //Target documents without createdAt
      [
        {
          $set: {
            createdAt: "$date", //Set createdAt to the value of the existing date field
            updatedAt: "$date", //Set updatedAt to the value of the existing date field (or use Date.now() for current date)
          },
        },
      ]
    );

    console.log(
      `Successfully updated ${result.modifiedCount} transactions with createdAt and updatedAt fields.`
    );
  } catch (error) {
    console.error("Error updating transactions:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateExistingTransactions();
