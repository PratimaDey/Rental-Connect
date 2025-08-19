// In: backend/controllers/adminController.js

const User = require('../models/User');

// Get all users for the admin dashboard
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while fetching users.' });
    }
};

// Delete a user by their ID
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

module.exports = { getAllUsers, deleteUser };