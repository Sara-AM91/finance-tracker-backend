const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbinit = require("./db/dbinit");

dotenv.config();
dbinit();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
