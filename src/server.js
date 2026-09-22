const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const app = require("./app");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

const startServer = async () => {
  try {
    if (!MONGO_URL) {
      console.warn("WARNING: MONGO_URL is not defined in environment variables.");
    } else {
      await mongoose.connect(MONGO_URL);
      console.log("Database connected successfully");
    }

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
