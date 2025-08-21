const express = require('express');
const router = express.Router();

// 1. Combine the controller imports into one line
const { getMyBookings, cancelBooking } = require('../controllers/bookingController');

// 2. Import the middleware only once
const { authRequired } = require('../middleware/authMiddleware');

// Defines the route: GET /api/bookings/my
router.route('/my').get(authRequired, getMyBookings);

// Defines the route: DELETE /api/bookings/:id
router.route('/:id').delete(authRequired, cancelBooking);

module.exports = router;