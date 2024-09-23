const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbinit = require("./db/dbinit");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
dbinit();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
