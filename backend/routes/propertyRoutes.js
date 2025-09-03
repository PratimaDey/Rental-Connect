const express = require("express");
const router = express.Router();

const { authRequired } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadImage");

// 1. Import all the controller functions you need
const {
  getAllProperties,
  getPropertyById,
  createBooking,
  searchProperties,
  createProperty,
  getMyProperties,
  addComment,
  reportProperty,
  updatePropertyStatus // --- NEW --- Import the new controller function
} = require('../controllers/propertyController');


// --- PUBLIC ROUTES ---
// These routes can be accessed by anyone.
router.get("/", getAllProperties);
router.get("/search", searchProperties);
router.get("/:id", getPropertyById);


// --- PROTECTED ROUTES ---
// These routes require a user to be logged in (handled by authRequired).
router.post("/", authRequired, upload.single("image"), createProperty); // Handles creating a new property with image upload
router.get("/my", authRequired, getMyProperties); // Fetches properties for the logged-in landlord

// --- NEW --- Add the protected PATCH route for updating the status
router.patch("/:id/status", authRequired, updatePropertyStatus);

router.post("/:id/book", authRequired, createBooking);
router.post('/:id/comments', authRequired, addComment);
router.post('/:id/report', authRequired, reportProperty);

module.exports = router;