const mongoose = require("mongoose");

// --- 1. Define a sub-schema for comments (No change here) ---
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// --- 2. NEW: Define a sub-schema for report details ---
const reportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema(
  {
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    rent: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    availableFrom: { type: Date, required: true },
    image: { type: String }, // store image filename
    comments: [commentSchema],
    reportDetails: { type: reportSchema },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
