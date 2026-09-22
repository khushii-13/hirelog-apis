const User = require("../models/user");

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User Not Found");
    error.statusCode = 400;
    throw error;
  }
  return user;
};

module.exports = {
  getUserProfile,
};
