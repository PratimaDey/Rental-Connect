
const User = require("../models/User");


const renterDashboard = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "Renter") {
      return res.status(403).json({ message: "Access denied: Not a Renter" });
    }

    
    res.json({
      message: `Welcome to your Renter dashboard, ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      renterFeatures: [
        "Search rentals",
        "Save favorite listings",
        "Apply for rentals"
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const landlordDashboard = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "Landlord") {
      return res.status(403).json({ message: "Access denied: Not a Landlord" });
    }

    
    res.json({
      message: `Welcome to your Landlord dashboard, ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      landlordFeatures: [
        "Add and manage listings",
        "View renter applications",
        "Communicate with renters"
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  renterDashboard,
  landlordDashboard
};
