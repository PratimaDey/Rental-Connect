const express = require('express');
const router = express.Router();
const { createPayment, getMyPayments, getLandlordPayments, confirmPayment } = require('../controllers/paymentController');
const { authRequired } = require('../middleware/authMiddleware');

router.post('/', authRequired, createPayment); // renter initiates payment (simulated)
router.get('/me', authRequired, getMyPayments); // renter payments
router.get('/landlord', authRequired, getLandlordPayments); // landlord view
router.patch('/:id/confirm', authRequired, confirmPayment); // landlord confirms

module.exports = router;
