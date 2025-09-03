const express = require("express");
const { sendMessage, getMessages, getContacts } = require("../controllers/messageController");
const { authRequired } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authRequired, sendMessage); // send message
router.get("/:withUserId", authRequired, getMessages); // get chat with a specific user

// Returns the list of users the logged-in user is allowed to message
router.get("/contacts/list", authRequired, getContacts);

module.exports = router;
