
const express = require("express");
const { renterDashboard, landlordDashboard } = require("../controllers/dashboardController");
const { authRequired } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/renter", authRequired, renterDashboard);
router.get("/landlord", authRequired, landlordDashboard);

module.exports = router;
