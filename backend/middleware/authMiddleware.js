
const User = require('../models/User');
const authRequired = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Not authorized" });
};


const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');

    if (user && user.role === 'Admin') {
      req.user = user; // Attach user object to the request for potential future use
      next(); // The user is an admin, proceed to the next function
    } else {
      res.status(403).json({ message: "Not authorized as an Admin." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin check.' });
  }
};

// --- UPDATE THE EXPORT ---
module.exports = { authRequired, admin };