const User = require('../models/User');

// @desc    Toggle a property in the user's wishlist
// @route   POST /api/users/wishlist
// @access  Private/Renter
const toggleWishlist = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.wishlist.indexOf(propertyId);
        if (index > -1) {
            // Property is already in wishlist, so remove it
            user.wishlist.splice(index, 1);
        } else {
            // Property is not in wishlist, so add it
            user.wishlist.push(propertyId);
        }

        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get the user's wishlist
// @route   GET /api/users/wishlist
// @access  Private/Renter
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update current user's profile
// @route   PUT /api/users/update-profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        const safe = user.toObject();
        delete safe.password;
        res.json(safe);
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { toggleWishlist, getWishlist, updateProfile };