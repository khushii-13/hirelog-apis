const authService = require("../services/authService");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    await authService.register({
      name,
      email,
      password,
      role,
      file: req.file,
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

    const { token } = await authService.login({ email, password });

    return sendResponse(res, 200, true, "Login successful", { token });
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    return sendResponse(res, 200, true, "User found successfully", user);
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = { register, login, getUser };
