const bcrypt = require("bcrypt");
const User = require("../models/user");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const login = async (req, res) =>{
 return res.status(200).json({
    message  : "Login hitted succesfully",
    htoken : "abc1237kkk"
 })
}

const getUser = async (req,res)=>{
    
    return res.status(200).json({
    message  : "Get user hitted succesfully",
    data : req.headers.htoken
 })
}
module.exports = { register, login, getUser};