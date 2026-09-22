const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { sendLoginEmail } = require("../utils/email");

const register = async ({ name, email, password, role, file }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let companyLogo = "";
  if (file && file.buffer) {
    const result = await uploadToCloudinary(file.buffer, {
      folder: "hirelog_logos",
    });
    companyLogo = result.secure_url;
  }

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
    companyLogo,
  });

  return newUser;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 400;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const data = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const SECRET_KEY = process.env.SECRET_KEY;
  const token = jwt.sign(data, SECRET_KEY, { expiresIn: "2h" });

  // Dispatch login email asynchronously
  sendLoginEmail(user.email, user.name);

  return { token, user: data };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User Not Found");
    error.statusCode = 400;
    throw error;
  }
  return user;
};

module.exports = {
  register,
  login,
  getUserById,
};
