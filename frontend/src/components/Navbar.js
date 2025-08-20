import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/auth/profile`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleDashboardClick = () => {
    if (!user) {
      navigate("/"); // Not logged in → send to login
    } else if (user.role === "Landlord") {
      navigate("/dashboard/landlord");
    } else if (user.role === "Renter") {
      navigate("/dashboard/renter");
    } 
  };

  const navStyle = {
    display: "flex",
    gap: "15px",
    padding: "20px 20px",
    alignItems: "center",
    background: "rgba(255,255,255,0.6)",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    fontWeight: 600
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto',
    fontWeight: 900, // Extra bold for prominence
    fontSize: '1.8rem', // Larger font size for branding
    letterSpacing: '0.8px',
    fontFamily: "'Poppins', sans-serif", // Modern, elegant font
    color: '#2c3e50', // Darker color for contrast
  };
 

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>Rental Connect</div>
      <Link to="/" style={linkStyle}>Login</Link>
      <Link to="/register" style={linkStyle}>Register</Link>
      <Link to="/profileupdate" style={linkStyle}>Update Profile</Link>
      <Link to="/advertisements" style={linkStyle}>Advertisements</Link>
      <button 
        style={{ ...linkStyle, background: "none", border: "none", cursor: "pointer" }}
        onClick={handleDashboardClick}
      >
        Dashboard
      </button>
    </nav>
  );
}
