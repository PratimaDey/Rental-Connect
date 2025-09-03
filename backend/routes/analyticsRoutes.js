// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Property = require("../models/Property");
const Payment = require("../models/Payment");
const { authRequired } = require("../middleware/authMiddleware"); 

// GET /api/analytics/landlord
router.get("/landlord", authRequired, async (req, res) => {
  try {
    const landlordId = req.session.userId; // or req.user.id if using JWT
    if (!landlordId) return res.status(401).json({ message: "Not authenticated" });

    const landlordObjId = new mongoose.Types.ObjectId(landlordId);

    // totals from payments
    const [incomeAgg] = await Payment.aggregate([
      { $match: { landlord: landlordObjId, paid: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [pendingAgg] = await Payment.aggregate([
      { $match: { landlord: landlordObjId, paid: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const incomeReceived = incomeAgg?.total || 0;
    const pendingDues = pendingAgg?.total || 0;

    // Occupancy
    const totalProperties = await Property.countDocuments({ landlord: landlordId });
    const occupiedProperties = await Property.countDocuments({ landlord: landlordId, isOccupied: true });
    const occupancyRate = totalProperties === 0 ? 0 : (occupiedProperties / totalProperties) * 100;

    // Monthly income for last 6 months (group by year-month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0,0,0,0);

    const monthlyAgg = await Payment.aggregate([
      { $match: { landlord: landlordObjId, paid: true, paidAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Convert to array for last 6 months
    const monthlyIncome = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = monthlyAgg.find(m => m._id.year === year && m._id.month === month);
      const total = found ? found.total : 0;
      const displayMonth = d.toLocaleString(undefined, { month: "short", year: "numeric" });
      monthlyIncome.push({ month: `${year}-${String(month).padStart(2, '0')}`, total, displayMonth });
    }

    res.json({
      incomeReceived,
      pendingDues,
      totalProperties,
      occupiedProperties,
      occupancyRate: Math.round((occupancyRate + Number.EPSILON) * 100) / 100,
      monthlyIncome
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;