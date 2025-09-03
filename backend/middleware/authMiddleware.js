const User = require('../models/User');

// This is the superior version of the function. It makes the user's data 
// available to any protected route that comes after it.
const authRequired = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authorized, please log in." });
    }

    // Find the user in the database using the ID from the session
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found." });
    }

    // Attach the complete user object to the request
    req.user = user;
    next(); // Proceed to the next function (e.g., the controller)

  } catch (error) {
    res.status(500).json({ message: 'Server error during authorization.' });
  }
};

// This function correctly checks for the 'Admin' role. It should also
// attach the user object for consistency.
const admin = async (req, res, next) => {
  try {
    // This check is slightly redundant if authRequired runs first,
    // but it provides an extra layer of security.
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authorized, please log in." });
    }

    const user = await User.findById(req.session.userId).select('-password');

    if (user && user.role === 'Admin') {
      req.user = user; // Attach user object
      next(); // The user is an admin, proceed
    } else {
      res.status(403).json({ message: "Not authorized as an Admin." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin check.' });
  }
};

module.exports = { authRequired, admin };