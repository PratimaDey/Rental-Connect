const express = require("express");
const { authRequired } = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

// 1. Import the new controller functions for the wishlist
const { toggleWishlist, getWishlist } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');

// --- EXISTING ROUTES ---

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


// --- 2. ADDED NEW WISHLIST ROUTES ---

// GET /api/users/wishlist -> Fetches the logged-in user's wishlist
router.get("/wishlist", authRequired, getWishlist);

// POST /api/users/wishlist -> Adds or removes a property from the wishlist
router.post("/wishlist", authRequired, toggleWishlist);
// PUT /api/users/update-profile -> Update current user's profile
router.put('/update-profile', authRequired, updateProfile);
// ------------------------------------

module.exports = router;