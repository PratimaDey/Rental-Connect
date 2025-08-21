const express = require("express");
const router = express.Router();
const { authRequired } = require("../middleware/authMiddleware");

// 1. Import all the controller functions you need
const {
  getAllProperties,
  getPropertyById,
  createBooking,
  searchProperties,
  createProperty,
  getMyProperties
} = require('../controllers/propertyController');


// --- PUBLIC ROUTES ---
router.get("/", getAllProperties);
router.get("/search", searchProperties);
router.get("/:id", getPropertyById);


// --- PROTECTED ROUTES ---
// NOTE: These routes require a user to be logged in
router.get("/my", authRequired, getMyProperties);
router.post("/", authRequired, createProperty);
router.post("/:id/book", authRequired, createBooking);

module.exports = router;