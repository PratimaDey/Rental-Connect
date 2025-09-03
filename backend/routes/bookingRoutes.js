const express = require('express');
const router = express.Router();

// 1. Combine the controller imports into one line
const { getMyBookings, cancelBooking, getPendingBookingsForLandlord, approveBooking, rejectBooking } = require('../controllers/bookingController');
// 2. Import the middleware only once
const { authRequired } = require('../middleware/authMiddleware');
// PATCH /api/bookings/:id/approve -> Approve a booking
router.patch('/:id/approve', authRequired, approveBooking);
// PATCH /api/bookings/:id/reject -> Reject a booking
router.patch('/:id/reject', authRequired, rejectBooking);
// GET /api/bookings/landlord-pending -> Fetches pending bookings for the logged-in landlord
router.get('/landlord-pending', authRequired, getPendingBookingsForLandlord);

// Defines the route: GET /api/bookings/my
router.route('/my').get(authRequired, getMyBookings);

// Defines the route: DELETE /api/bookings/:id
router.route('/:id').delete(authRequired, cancelBooking);

module.exports = router;