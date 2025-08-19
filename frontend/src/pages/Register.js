import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Renter" });
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(`${API}/auth/register`, formData);
      setMessage(""); // clear any old errors

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  const cardStyle = {
    width: "320px",
    height: "300px",
    margin: "80px auto",
    padding: "32px 24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 30px rgba(245, 122, 136, 0.3)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative"
  };

  const popupStyle = {
    position: "absolute",
    top: "-70px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#4BB543",
    color: "white",
    padding: "10px 24px",
    borderRadius: "8px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    fontWeight: "600",
    zIndex: 1000,
  };

  const inputStyle = {
    width: "80%",
    padding: "10px 12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px"
  };

  const buttonStyle = {
    width: "40%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "20px",
    border: "black 10px",
    cursor: "pointer",
    background: "#f57a88",
    color: "#fff",
    fontWeight: 600
  };

  return (
    <div style={cardStyle}>
      {showPopup && <div style={popupStyle}>Registered successfully!</div>}
      <h2 style={{ marginTop: 0 }}>Create an account</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          style={inputStyle}
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Renter">Renter</option>
          <option value="Landlord">Landlord</option>
        </select>
        <button style={buttonStyle} type="submit">
          Register
        </button>
      </form>
      {message && <p style={{ marginTop: 12, color: "red" }}>{message}</p>}
    </div>
  );
}