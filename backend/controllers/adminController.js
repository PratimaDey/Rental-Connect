const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while fetching users.' });
    }
};

// @desc    Delete a user by ID
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'Admin') {
                 return res.status(400).json({ message: 'Cannot delete an admin account.' });
            }
            await user.deleteOne();
            res.status(200).json({ message: 'User removed successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error while deleting user.' });
    }
};

// @desc    Get all reported properties
// @route   GET /api/admin/properties/reported
// @access  Private/Admin
const getReportedProperties = async (req, res) => {
    try {
        // --- CHANGE: Find properties where the 'reportDetails' field EXISTS ---
        const properties = await Property.find({ reportDetails: { $exists: true } }).populate('landlord', 'name');
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while fetching reported properties.' });
    }
};

// @desc    Delete a property by ID
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            await property.deleteOne();
            res.status(200).json({ message: 'Property removed successfully.' });
        } else {
            res.status(404).json({ message: 'Property not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error while deleting property.' });
    }
};

// --- NEW FUNCTION ---
// @desc    Dismiss a report on a property
// @route   PUT /api/admin/properties/:id/dismiss
// @access  Private/Admin
const dismissReport = async (req, res) => {
  try {
    // Use findOneAndUpdate with the $unset operator to completely remove the field
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id }, 
      { $unset: { reportDetails: "" } }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    res.status(200).json({ message: "Report dismissed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error while dismissing report.", error: error.message });
  }
};

// --- UPDATE THE EXPORT ---
module.exports = {
    getAllUsers,
    deleteUser,
    getReportedProperties,
    deleteProperty,
    dismissReport // Add the new function here
};
