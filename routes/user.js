const express = require("express");
const userRouter = express.Router();
const {getUser} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/private/users/get-user:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       400:
 *         description: User not found
 */
userRouter.get("/get-user", authMiddleware, getUser);

module.exports = userRouter;