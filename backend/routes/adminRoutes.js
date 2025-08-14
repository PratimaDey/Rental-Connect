// In: backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const { admin } = require("../middleware/authMiddleware");

// GET /api/admin/users -> Fetches all users
router.route('/users').get(admin, getAllUsers);

// DELETE /api/admin/users/:id -> Deletes a specific user
router.route('/users/:id').delete(admin, deleteUser);

module.exports = router;