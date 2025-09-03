// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  landlordConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
