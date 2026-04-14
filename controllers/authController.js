const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const data = {
      id: userExists._id,
      email: userExists.email,
      role: userExists.role,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign(data, SECRET_KEY, { expiresIn: "2h" });

    return res.status(200).json({
      message: "Login successful",
      htoken: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
try {

  const user = req.user;
  const dbUser = await User.findOne({_id : user.id}).select("-password");
  if(!dbUser){
    return res.status(400).json({
      message : "User Not Found"
    })
  }
  return res.status(200).json({
    message: "User found succesfully",
    data: dbUser,
  });
} catch (error) {
      return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
}
};
module.exports = { register, login, getUser };
