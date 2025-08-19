const express = require("express");
const { authRequired } = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

// Get all landlords
router.get("/landlords", authRequired, async (req, res) => {
  try {
    const landlords = await User.find({ role: "Landlord" }).select("name email");
    res.json(landlords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all renters
router.get("/renters", authRequired, async (req, res) => {
  try {
    const renters = await User.find({ role: "Renter" }).select("name email");
    res.json(renters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
