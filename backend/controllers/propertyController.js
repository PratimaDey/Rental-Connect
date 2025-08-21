const Property = require('../models/Property');
const Booking = require('../models/bookingModel');
const User = require('../models/User');

// --- THIS IS THE CORRECTED FUNCTION ---
// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  try {
    // This is the logic that was missing:
    const properties = await Property.find({}).populate('landlord', 'name email');
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// ------------------------------------

// @desc    Fetch a single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name email');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new booking for a property
// @route   POST /api/properties/:id/book
// @access  Private/Renter
const createBooking = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        const booking = await Booking.create({
            property: property._id,
            renter: req.session.userId,
            landlord: property.landlord,
        });
        res.status(201).json({ message: "Booking successful!", booking });
    } catch (error) {
        res.status(500).json({ message: "Server error while creating booking." });
    }
};

// @desc    Search for properties by area and/or room number (bedrooms)
// @route   GET /api/properties/search
// @access  Public
const searchProperties = async (req, res) => {
    try {
        const { area, bedrooms } = req.query;
        const query = {};
        if (area) {
            query.address = { $regex: area, $options: 'i' };
        }
        if (bedrooms) {
            query.bedrooms = Number(bedrooms);
        }
        const properties = await Property.find(query).populate('landlord', 'name email');
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while searching properties.' });
    }
};

// @desc    Create a new property advertisement
// @route   POST /api/properties
// @access  Private/Landlord
const createProperty = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== "Landlord") {
            return res.status(403).json({ message: "Only landlords can create advertisements" });
        }
        const { title, description, address, rent, bedrooms, bathrooms, availableFrom } = req.body;
        const property = await Property.create({
            landlord: user._id,
            title, description, address, rent,
            bedrooms, bathrooms, availableFrom,
        });
        res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch properties for the logged-in landlord
// @route   GET /api/properties/my
// @access  Private/Landlord
const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ landlord: req.session.userId }).sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- UPDATE THE EXPORT ---
module.exports = {
    getAllProperties,
    getPropertyById,
    createBooking,
    searchProperties,
    createProperty,
    getMyProperties
};