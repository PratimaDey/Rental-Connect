import React, { useEffect, useState } from "react";
import SidebarLandlord from "../components/SidebarLandlord";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function LandlordDashboard() {
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("createAd");
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
      case "createAd":
        return <h2>Create Advertisement Form will go here</h2>;
      case "rentDetails":
        return <h2>Rent details & dues table will go here</h2>;
      default:
        return <h2>Welcome Landlord!</h2>;
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading dashboard...</p>;

  return (
    <div style={{ display: "flex" }}>
      <SidebarLandlord onLogout={handleLogout} onSelect={setActiveComponent} />
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
