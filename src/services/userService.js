const pool = require("../config/db");

const getUserProfile = async (userId) => {
  const [users] = await pool.query("SELECT id, name, email, role, company_logo, created_at, updated_at FROM users WHERE id = ?", [userId]);
  if (users.length === 0) {
    const error = new Error("User Not Found");
    error.statusCode = 400;
    throw error;
  }
  return users[0];
};

module.exports = {
  getUserProfile,
};
