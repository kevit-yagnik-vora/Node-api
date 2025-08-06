const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/blacklistedTokenModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
  }
  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.token = token;
    req.user = isVerified;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Invalid token.", error: error });
  }
};

module.exports = authMiddleware;
