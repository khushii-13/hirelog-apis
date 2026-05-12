const express = require("express");
const userRouter = express.Router();
const {getUser} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");


userRouter.get("/get-user",authMiddleware,getUser);

module.exports = userRouter;