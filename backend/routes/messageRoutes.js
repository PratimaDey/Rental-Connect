const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { authRequired } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authRequired, sendMessage); // send message
router.get("/:withUserId", authRequired, getMessages); // get chat with a specific user

module.exports = router;
