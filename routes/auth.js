const express = require("express");
const authRouter = express.Router();
const {register, login, getUser} = require("../controllers/authController");

authRouter.post("/register", register);
authRouter.post("/login",login);
authRouter.get("/get-user",getUser);

module.exports = authRouter;