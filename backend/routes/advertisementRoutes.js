const express = require("express");
const router = express.Router();

// Import controllers
const {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  getUserAdvertisements,
  getAdvertisementsByUser,
} = require("../controllers/advertisementController");

// Import middleware
const {
  validateCreateAdvertisement,
  validateUpdateAdvertisement,
  validateQueryParams,
} = require("../middleware/advertisementValidation");

const {
  uploadAdvertisementImages,
  handleUploadError,
} = require("../middleware/uploadMiddleware");

// Routes

// CREATE - Requires session authentication
router.post(
  "/",
  uploadAdvertisementImages,
  handleUploadError,
  validateCreateAdvertisement,
  createAdvertisement
);

// READ ALL - Public route
router.get("/", validateQueryParams, getAdvertisements);

// READ USER ADS - Requires session authentication
router.get("/user/my-ads", validateQueryParams, getUserAdvertisements);

// READ ADS BY SPECIFIC USER - Public route
router.get("/user/:userId", validateQueryParams, getAdvertisementsByUser);

// READ SINGLE - Public route
router.get("/:id", getAdvertisementById);

// UPDATE - Requires session authentication
router.put(
  "/:id",
  uploadAdvertisementImages,
  handleUploadError,
  validateUpdateAdvertisement,
  updateAdvertisement
);

// DELETE - Requires session authentication
router.delete("/:id", deleteAdvertisement);

module.exports = router;