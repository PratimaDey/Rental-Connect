import React, { useEffect, useState } from "react";
import SidebarRenter from "../components/SidebarRenter";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function RenterDashboard() {
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("rentDetails");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/auth/profile`)
      .then(res => setUser(res.data))
      .catch(() => navigate("/")) // redirect if not logged in
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "rentDetails":
        return <h2>Your Rent details will go here</h2>;
      case "wishlist":
        return <h2>Your Wishlist items will go here</h2>;
      default:
        return <h2>Welcome Renter!</h2>;
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading dashboard...</p>;

  return (
    <div style={{ display: "flex" }}>
      <SidebarRenter onLogout={handleLogout} onSelect={setActiveComponent} />
      <div style={{ padding: "20px", flex: 1 }}>
        {user && (
          <>
            <h2>Welcome, {user.name}</h2>
            <p>Role: {user.role}</p>
          </>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
