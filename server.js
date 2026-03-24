const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
app.get("/", (req, res) => {
  const h1 = "<h1>Hello everyone</h1>";
  res.send(h1);
});
app.get("/home", (req, res) => {
  const h1 = "<h1>Hello Home</h1>";
  res.send(h1);
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(8000, () => {
      console.log(`Server is listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();
