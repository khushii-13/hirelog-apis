const express = require("express");
const dashboardRouter = express.Router();
const { dashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics API
 */

/**
 * @swagger
 * /api/private/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       500:
 *         description: Server error
 */
dashboardRouter.get("/", authMiddleware, dashboard);

module.exports = dashboardRouter;
