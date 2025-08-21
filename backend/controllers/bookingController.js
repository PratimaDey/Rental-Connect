const Booking = require('../models/bookingModel');

// @desc    Get all bookings for the logged-in renter
// @route   GET /api/bookings/my
// @access  Private/Renter
const getMyBookings = async (req, res) => {
  try {
    // Find bookings where the 'renter' field matches the logged-in user's ID
    // Also, populate the related property and landlord details
    const bookings = await Booking.find({ renter: req.session.userId })
      .populate('property', 'title address rent')
      .populate('landlord', 'name email');
      
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- THIS IS THE NEW FUNCTION YOU NEEDED ---
// @desc    Cancel/delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Renter
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Security check: Make sure the logged-in user is the one who made the booking
    if (booking.renter.toString() !== req.session.userId) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// ------------------------------------------


// Update the export to include both functions
module.exports = { getMyBookings, cancelBooking };