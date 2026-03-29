const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware =  (req, res, next) => {
  try {
    const token = req.headers.htoken;

    if (!token) {
      return res.status(400).json({
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
module.exports = authMiddleware;
