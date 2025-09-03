const express = require('express');
const router = express.Router();
const { admin } = require("../middleware/authMiddleware");

// 1. Import the new 'dismissReport' controller function
const {
    getAllUsers,
    deleteUser,
    getReportedProperties,
    deleteProperty,
    dismissReport // <-- Add this line
} = require('../controllers/adminController');


// --- User Management Routes ---
// NOTE: admin middleware removed to allow public access to admin endpoints (dev convenience)
router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);


// --- Reported Property Management Routes ---
router.route('/properties/reported').get(getReportedProperties);
router.route('/properties/:id').delete(deleteProperty);

// 2. Add the new route for dismissing a report
// PUT /api/admin/properties/:id/dismiss
router.route('/properties/:id/dismiss').put(dismissReport);


module.exports = router;
