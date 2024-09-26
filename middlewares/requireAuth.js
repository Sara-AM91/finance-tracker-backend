const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const requireAuth = async (res, req, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Not Authorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findById(_id).select("_id"); // Attach user ID to request
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Not Authorized" });
  }
};

module.exports = requireAuth;
