const Message = require("../models/Message");
const User = require("../models/User");

// Send message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!req.session.userId) return res.status(401).json({ message: "Not authorized" });

    if (!receiverId || !text) return res.status(400).json({ message: "Missing receiver or text" });

    const message = await Message.create({
      sender: req.session.userId,
      receiver: receiverId,
      text,
    });

    res.status(201).json({ message: "Message sent", data: message });
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

module.exports = { sendMessage, getMessages };
