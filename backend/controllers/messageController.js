const Message = require("../models/Message");
const User = require("../models/User");
const Booking = require('../models/bookingModel');

// Send message
const sendMessage = async (req, res) => {
  try {
    // Accept either { receiverId, text } or { to, content }
    const receiverId = req.body.receiverId || req.body.to;
    const text = req.body.text || req.body.content;

    if (!req.session.userId) return res.status(401).json({ message: "Not authorized" });

    if (!receiverId || !text) return res.status(400).json({ message: "Missing receiver or text" });

    const message = await Message.create({
      sender: req.session.userId,
      receiver: receiverId,
      text,
    });

    // return the created message object directly for frontend convenience
    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages between logged-in user and another user
const getMessages = async (req, res) => {
  try {
    const { withUserId } = req.params;

    if (!req.session.userId) return res.status(401).json({ message: "Not authorized" });

    const messages = await Message.find({
      $or: [
        { sender: req.session.userId, receiver: withUserId },
        { sender: withUserId, receiver: req.session.userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contacts the logged-in user is allowed to message
// - If logged-in user is a Landlord: return renters who have bookings for this landlord's properties that are Confirmed
// - If logged-in user is a Renter: return landlords for properties this renter has booked and that are Confirmed
const getContacts = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    // fetch role
    const me = await User.findById(userId).select('role name email');
    if (!me) return res.status(404).json({ message: 'User not found' });

    if (me.role === 'Landlord') {
      // Find bookings where landlord is me and status is Confirmed (or you could include Pending if desired)
      const bookings = await Booking.find({ landlord: userId, status: 'Confirmed' }).populate('renter', 'name email');
      // unique renters
      const map = {};
      bookings.forEach(b => { if (b.renter) map[b.renter._id] = b.renter; });
      const renters = Object.values(map);
      return res.status(200).json(renters);
    }

    if (me.role === 'Renter') {
      // Find bookings where renter is me and status is Confirmed
      const bookings = await Booking.find({ renter: userId, status: 'Confirmed' }).populate('landlord', 'name email');
      const map = {};
      bookings.forEach(b => { if (b.landlord) map[b.landlord._id] = b.landlord; });
      const landlords = Object.values(map);
      return res.status(200).json(landlords);
    }

    // default empty
    res.status(200).json([]);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendMessage, getMessages, getContacts };

