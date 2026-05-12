const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendResponse(res, 400, false, "User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return sendResponse(res, 201, true, "User created successfully");
  } catch (error) {
    return errorHandler(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return sendResponse(res, 400, false, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const data = {
      id: userExists._id,
      email: userExists.email,
      role: userExists.role,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign(data, SECRET_KEY, { expiresIn: "2h" });

    return sendResponse(res, 200, true, "Login successful", { token });
  } catch (error) {
    return errorHandler({ statusCode: 500, message: "Server error" }, res);
  }
};

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
module.exports = { register, login, getUser };
