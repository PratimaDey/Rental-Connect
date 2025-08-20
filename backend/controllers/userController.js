const User = require("../models/User");

// Update user profile with optional base64 image
const updateProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, email, profileImage } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Handle base64 image if provided
    if (profileImage) {
      if (!profileImage.startsWith("data:image/")) {
        return res
          .status(400)
          .json({
            message: "Invalid image format. Must be base64 encoded image.",
          });
      }

      // Check image size (base64 is ~33% larger than original, so 5MB * 0.75 = ~3.75MB base64 limit)
      const imageSizeInBytes = (profileImage.length * 3) / 4;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (imageSizeInBytes > maxSizeInBytes) {
        return res
          .status(400)
          .json({ message: "Image too large. Maximum size is 5MB." });
      }

      updateData.profileImage = profileImage;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateProfile,
  getProfile,
};
