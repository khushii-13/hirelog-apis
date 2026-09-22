const userService = require("../services/userService");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    return sendResponse(res, 200, true, "User found successfully", user);
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = { getUser };
