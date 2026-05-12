const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const getUser = async (req, res) => {
try {

  const user = req.user;
  const dbUser = await User.findOne({_id : user.id}).select("-password");
  if(!dbUser){
    return sendResponse(res, 400, false, "User Not Found");
  }
  return sendResponse(res, 200, true, "User found successfully", dbUser);
} catch (error) {
      return errorHandler(error, res);
}
};
module.exports = {  getUser };
