const Property = require('../models/Property');
const Booking = require('../models/bookingModel');
const User = require('../models/User');

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('landlord', 'name email');
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

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
        let image = undefined;
        if (req.file) {
            image = req.file.filename;
        }
        const property = await Property.create({
            landlord: user._id,
            title, description, address, rent,
            bedrooms, bathrooms, availableFrom,
            image,
            status: 'Available',
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

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const property = await Property.findById(req.params.id);

        if (property) {
            const comment = {
                user: req.session.userId,
                name: req.user.name, 
                text,
            };

            property.comments.push(comment);
            await property.save();
            res.status(201).json({ message: "Comment added successfully" });
        } else {
            res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error while adding comment." });
    }
};

const reportProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (property.reportDetails) {
      return res.status(400).json({ message: "This property has already been reported." });
    }
    const { reason } = req.body;
    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: "A reason is required to report a property." });
    }
    property.reportDetails = {
      reportedBy: req.session.userId,
      reason: reason,
    };
    await property.save();
    res.status(200).json({ message: "Property reported successfully. Our team will review it shortly." });
  } catch (error) {
    res.status(500).json({ message: "Server error while reporting property." });
  }
};

// --- THIS IS THE NEW FUNCTION ---
// @desc    Update a property's availability status
// @route   PATCH /api/properties/:id/status
// @access  Private/Landlord
const updatePropertyStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const property = await Property.findById(req.params.id);

        // 1. Validate the new status
        if (status !== 'Available' && status !== 'Unavailable') {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        // 2. Check if the property exists
        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        // 3. Verify that the user owns this property
        if (property.landlord.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'Not authorized to update this property.' });
        }

        // 4. Update the status and save
        property.status = status;
        await property.save();
        
        res.status(200).json({ message: 'Status updated successfully', property });

    } catch (error) {
        res.status(500).json({ message: 'Server error while updating status.' });
    }
};


// --- EXPORTS (with the new function added) ---
module.exports = {
    getAllProperties,
    getPropertyById,
    createBooking,
    searchProperties,
    createProperty,
    getMyProperties,
    addComment,
    reportProperty,
    updatePropertyStatus, // --- NEW --- Export the new function
};
