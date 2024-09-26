const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbinit = require("./db/dbinit");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

dotenv.config();
dbinit();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
