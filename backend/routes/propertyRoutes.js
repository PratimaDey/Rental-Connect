const express = require("express");
const Property = require("../models/Property");
const User = require("../models/User");
const { authRequired } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create Advertisement (Landlords only)
router.post("/", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== "Landlord") {
      return res.status(403).json({ message: "Only landlords can create advertisements" });
    }

    const { title, description, address, rent, bedrooms, bathrooms, availableFrom } = req.body;

    const property = await Property.create({
      landlord: user._id,
      title,
      description,
      address,
      rent,
      bedrooms,
      bathrooms,
      availableFrom,
    });

    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Fetch all properties created by logged-in landlord
router.get("/my", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== "Landlord") {
      return res.status(403).json({ message: "Only landlords can view their advertisements" });
    }

    const properties = await Property.find({ landlord: user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
