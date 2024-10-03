const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbinit = require("./db/dbinit");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
dbinit();

const app = express();
app.use(cors());
app.use(express.json());

//Add this middleware to set Cache-Control headers
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/user", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
