const express = require("express");
const dashboardRouter = express.Router();
const { dashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

dashboardRouter.get("/", authMiddleware, dashboard);

module.exports = dashboardRouter;
