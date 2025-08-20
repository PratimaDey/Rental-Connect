// // Get user profile
// router.get("/profile", authRequired, getProfile);

// // Update user profile with optional base64 image
// router.put("/profile", authRequired, updateProfile);

// module.exports = router;


const express = require("express");
const { updateProfile, getProfile } = require("../controllers/userController");
const { authRequired } = require("../middleware/authMiddleware");

const router = express.Router();

// Get user profile
router.get("/profile", authRequired, getProfile);

// Update user profile with optional base64 image
router.put("/profile", authRequired, updateProfile);


module.exports = router;