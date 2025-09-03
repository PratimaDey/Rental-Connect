import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Short-circuit: allow a hardcoded admin/admin login on the client
      if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
        const profile = { name: 'Admin', email: 'admin@gmail.com', role: 'Admin' };
        if (login) login(profile);
        localStorage.setItem('loggedInUser', JSON.stringify(profile));
        navigate('/dashboard/admin');
        return;
      }

      // Normal login flow via backend
      await axios.post(`${API}/auth/login`, formData);
      const profileRes = await axios.get(`${API}/auth/profile`);
      const profile = profileRes.data;
      // update global auth context so components know user is logged in
      if (login) login(profile);
      localStorage.setItem("loggedInUser", JSON.stringify(profile));
      if (profile.role === "Renter") {
        navigate("/dashboard/renter");
      } else if (profile.role === "Landlord") {
        navigate("/dashboard/landlord");
      } else if (profile.role === "Admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const cardStyle = {
    width: "320px",
    minHeight: "200px", // changed from height to minHeight
    margin: "80px auto",
    padding: "32px 24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 30px rgba(245, 122, 136, 0.3)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const inputStyle = {
    width: "80%",
    padding: "10px 12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "40%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "20px",
    border: "none", // fixed border
    cursor: "pointer",
    background: "#f57a88",
    color: "#fff",
    fontWeight: 600,
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button style={buttonStyle} type="submit">
          Login
        </button>
      </form>
      {message && <p style={{ marginTop: 12, color: "red" }}>{message}</p>}
    </div>
  );
}