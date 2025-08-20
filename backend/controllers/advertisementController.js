const Advertisement = require("../models/Advertisement");
const User = require("../models/User");

// Create a new advertisement
const createAdvertisement = async (req, res) => {
  try {
    const userId = req.session.userId;
    const {
      title,
      description,
      price,
      location,
      category,
      amenities,
      contactInfo,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in to create an advertisement.",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get image URLs if files were uploaded
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Create new advertisement
    const advertisement = new Advertisement({
      title,
      description,
      price,
      location,
      category,
      amenities: amenities || [],
      images,
      contactInfo,
      createdBy: userId,
    });

    await advertisement.save();

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      data: advertisement,
    });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all advertisements with filtering and pagination
const getAdvertisements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      location,
      search,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Execute query with pagination
    const advertisements = await Advertisement.find(filter)
      .populate("createdBy", "name email profileImage") // Populate user details
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Advertisement.countDocuments(filter);

    res.json({
      success: true,
      data: advertisements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get advertisement by ID
const getAdvertisementById = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id).populate(
      "createdBy",
      "name email profileImage phone"
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Increment view count
    advertisement.views += 1;
    await advertisement.save();

    res.json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update advertisement
const updateAdvertisement = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in to update an advertisement.",
      });
    }

    // Check if advertisement exists
    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Check if user owns the advertisement
    if (advertisement.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this advertisement",
      });
    }

    // Handle image updates if new files are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      req.body.images = [...advertisement.images, ...newImages];
    }

    // Update advertisement
    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email profileImage");

    res.json({
      success: true,
      message: "Advertisement updated successfully",
      data: updatedAdvertisement,
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete advertisement (soft delete)
const deleteAdvertisement = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in to delete an advertisement.",
      });
    }

    // Check if advertisement exists
    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Check if user owns the advertisement
    if (advertisement.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this advertisement",
      });
    }

    // Soft delete by setting isActive to false
    advertisement.isActive = false;
    await advertisement.save();

    res.json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's advertisements
const getUserAdvertisements = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Not authenticated. Please log in to view your advertisements.",
      });
    }

    const advertisements = await Advertisement.find({
      createdBy: userId,
      isActive: true,
    })
      .populate("createdBy", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Advertisement.countDocuments({
      createdBy: userId,
      isActive: true,
    });

    res.json({
      success: true,
      data: advertisements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get advertisements by specific user (public endpoint)
const getAdvertisementsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const advertisements = await Advertisement.find({
      createdBy: userId,
      isActive: true,
    })
      .populate("createdBy", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Advertisement.countDocuments({
      createdBy: userId,
      isActive: true,
    });

    res.json({
      success: true,
      data: advertisements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  getUserAdvertisements,
  getAdvertisementsByUser,
};