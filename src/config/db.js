const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// Create a connection pool using the MySQL URL from environment variables
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
