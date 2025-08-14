
const express = require("express");
const { registerUser, loginUser, logoutUser, getProfile } = require("../controllers/authController");
const { authRequired } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authRequired, getProfile);

module.exports = router;
