
const User = require("../models/User");
const bcrypt = require("bcryptjs");


const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

  
    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.status(201).json({ message: "Registered successfully", user: { name, email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.json({ message: "Login successful", user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};


const getProfile = async (req, res) => {
  const user = await User.findById(req.session.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile
};
