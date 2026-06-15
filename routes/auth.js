const express = require("express");
const authRouter = express.Router();
const {register, login, getUser} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

authRouter.post("/register", upload.single("companyLogo"), register);
authRouter.post("/login",login);
authRouter.get("/get-user",authMiddleware,getUser);

module.exports = authRouter;