// components/LandlordAnalytics.js
import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

function formatCurrency(num) {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function LandlordAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    incomeReceived: 0,
    pendingDues: 0,
    totalProperties: 0,
    occupiedProperties: 0,
    occupancyRate: 0,
    monthlyIncome: [], // [{month: '2025-08', total: 123}]
  });
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/analytics/landlord`, { withCredentials: true });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics. Check the server console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const {
    incomeReceived,
    pendingDues,
    totalProperties,
    occupiedProperties,
    occupancyRate,
    monthlyIncome,
  } = analytics;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Analytics</h2>
        <div>
          <button
            onClick={fetchAnalytics}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px", padding: 16, borderRadius: 8, background: "#fff", border: "1px solid #eaeaea" }}>
          <h4 style={{ margin: 0 }}>Total income received</h4>
          <p style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{formatCurrency(incomeReceived)}</p>
        </div>

        <div style={{ flex: "1 1 220px", padding: 16, borderRadius: 8, background: "#fff", border: "1px solid #eaeaea" }}>
          <h4 style={{ margin: 0 }}>Pending dues</h4>
          <p style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{formatCurrency(pendingDues)}</p>
        </div>

        <div style={{ flex: "1 1 220px", padding: 16, borderRadius: 8, background: "#fff", border: "1px solid #eaeaea" }}>
          <h4 style={{ margin: 0 }}>Unit occupancy</h4>
          <p style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>
            {occupiedProperties} / {totalProperties} ({Math.round(occupancyRate * 100) / 100}%)
          </p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Monthly income (last 6 months)</h3>
        {monthlyIncome && monthlyIncome.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: 8 }}>Month</th>
                <th style={{ padding: 8 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {monthlyIncome.map((m) => (
                <tr key={m.month} style={{ borderBottom: "1px solid #f2f2f2" }}>
                  <td style={{ padding: 8 }}>{m.displayMonth || m.month}</td>
                  <td style={{ padding: 8 }}>{formatCurrency(m.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#666" }}>No monthly income data available.</p>
        )}
      </div>
    </div>
  );
}