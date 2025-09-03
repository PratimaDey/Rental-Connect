import Property from "../models/Property.js";
import Payment from "../models/Payment.js";

export const getLandlordAnalytics = async (req, res) => {
  try {
    const landlordId = req.user?._id || req.session?.userId; // support both

    if (!landlordId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Properties
    const properties = await Property.find({ landlord: landlordId });
    const totalUnits = properties.length;
    const occupiedUnits = properties.filter(p => p.isOccupied).length;
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    // Payments
    const payments = await Payment.find({ landlord: landlordId });

    // Income received
    const incomeReceived = payments
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    // Pending dues (sum of amounts, not just count)
    const pendingDues = payments
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    // Monthly income (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyIncomeAgg = await Payment.aggregate([
      { 
        $match: { 
          landlord: landlordId, 
          status: "paid", 
          paidAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Fill missing months
    const monthlyIncome = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = monthlyIncomeAgg.find(
        m => m._id.year === year && m._id.month === month
      );
      const total = found ? found.total : 0;
      const displayMonth = d.toLocaleString(undefined, { month: "short", year: "numeric" });
      monthlyIncome.push({ month: `${year}-${String(month).padStart(2, "0")}`, total, displayMonth });
    }

    res.json({
      incomeReceived,
      pendingDues,
      totalUnits,
      occupiedUnits,
      occupancyRate: Math.round((occupancyRate + Number.EPSILON) * 100) / 100,
      monthlyIncome
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};