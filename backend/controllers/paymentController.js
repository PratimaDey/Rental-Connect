const Payment = require('../models/Payment');
const Property = require('../models/Property');

// Create a payment entry (simulate payment processor callback)
const createPayment = async (req, res) => {
  try {
    const { propertyId, month } = req.body; // month is optional metadata
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const payment = await Payment.create({
      property: property._id,
      landlord: property.landlord,
      renter: req.session.userId,
      amount: property.rent,
      dueDate: new Date(),
      paid: true,
      paidAt: new Date(),
    });
    // populate property and renter for frontend convenience
    const full = await Payment.findById(payment._id).populate('property', 'title address rent image').populate('renter', 'name email');
    res.status(201).json(full);
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Renter: list payments for this renter
const getMyPayments = async (req, res) => {
  try {
  const payments = await Payment.find({ renter: req.session.userId }).populate('property', 'title address rent image').populate('landlord', 'name email');
    res.json(payments);
  } catch (err) {
    console.error('Get my payments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Landlord: get payments for landlord's properties (pending confirmation)
const getLandlordPayments = async (req, res) => {
  try {
  const payments = await Payment.find({ landlord: req.session.userId }).populate('property', 'title address rent image').populate('renter', 'name email');
    res.json(payments);
  } catch (err) {
    console.error('Get landlord payments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Landlord confirms they received payment
const confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.landlord.toString() !== req.session.userId) return res.status(403).json({ message: 'Not authorized' });

  payment.landlordConfirmed = true;
  await payment.save();
  const full = await Payment.findById(payment._id).populate('property', 'title address rent image').populate('renter', 'name email');
  res.json(full);
  } catch (err) {
    console.error('Confirm payment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPayment, getMyPayments, getLandlordPayments, confirmPayment };
