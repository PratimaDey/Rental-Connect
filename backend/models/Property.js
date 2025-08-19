const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
