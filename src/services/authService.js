const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { uploadToCloudinary } = require("../config/cloudinary");
const { sendLoginEmail } = require("../utils/email");

const register = async ({ name, email, password, role, file }) => {
  const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (existingUser.length > 0) {
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

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role, company_logo) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashPassword, role, companyLogo]
  );

  return { id: result.insertId, name, email, role, companyLogo };
};

const login = async ({ email, password }) => {
  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 400;
    throw error;
  }
  
  const user = users[0];

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const data = {
    id: user.id,
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
  const [users] = await pool.query("SELECT id, name, email, role, company_logo, created_at, updated_at FROM users WHERE id = ?", [userId]);
  if (users.length === 0) {
    const error = new Error("User Not Found");
    error.statusCode = 400;
    throw error;
  }
  return users[0];
};

module.exports = {
  register,
  login,
  getUserById,
};
