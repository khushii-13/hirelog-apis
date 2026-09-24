const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const pool = require("./config/db");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Test the database connection
    await pool.getConnection();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is listening on http://${HOST}:${PORT}`);
      console.log(`Swagger documentation available at http://${HOST}:${PORT}/docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
