
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (!user) {
      navigate("/login");
    } else if ((user.role || "").toLowerCase() === "admin") {
      navigate("/dashboard/admin");
    } else if ((user.role || "").toLowerCase() === "landlord" || (user.role || "").toLowerCase() === "landloard") {
      navigate("/dashboard/landlord");
    } else if ((user.role || "").toLowerCase() === "renter") {
      navigate("/dashboard/renter");
    }
  };


  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      if (logout) await logout();
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  // --- Styles ---
  const navStyle = {
    display: "flex",
    gap: "15px",
    padding: "20px 40px", // Increased horizontal padding
    alignItems: "center",
    background: "rgba(255,255,255,0.6)",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  };
  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    fontSize: '1rem',
  };
  const brandStyle = {
    marginRight: 'auto', // Pushes all other items to the right
    fontWeight: 900,
    fontSize: '1.8rem',
    letterSpacing: '0.8px',
  fontFamily: "'Epunda Slab', 'Poppins', serif",
    color: '#2c3e50',
  };
  const buttonStyle = {
    ...linkStyle,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  // --- FIX 2: Corrected the entire return statement ---
  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, ...brandStyle }}>
        <img src="/favicon.svg" alt="logo" style={{ width: 32, height: 32, marginRight: 10, verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}>Rental Connect</span>
      </Link>
      {user ? (
        <>
          <span style={{ fontWeight: 500 }}>Welcome, {user.name}!</span>
          <button style={buttonStyle} onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button style={buttonStyle} onClick={handleLogout}>
            🚪Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={linkStyle}>Register</Link>
        </>
      )}
    </nav>
  );
}