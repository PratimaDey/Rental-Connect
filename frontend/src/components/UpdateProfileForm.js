import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function UpdateProfileForm({ onClose }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  occupation: "",
  emergencyContact: "",
  houseAddress: "",
  });
  const [loading, setLoading] = useState(true);
  // --- FIX: Add state to handle potential errors from the API call ---
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/auth/profile`)
      .then((res) => {
        // --- FIX: Check if response data actually exists before using it ---
        if (res.data) {
          setUser(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            company: res.data.company || "",
            occupation: res.data.occupation || "",
            emergencyContact: res.data.emergencyContact || "",
            houseAddress: res.data.houseAddress || "",
          });
        } else {
          // Handle cases where API returns a 200 OK but no data
          setError("Could not find profile data.");
        }
      })
      // --- FIX: Add a .catch block to handle network or server errors ---
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load your profile. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  await axios.put(`${API}/users/update-profile`, formData, { withCredentials: true });
      alert("Profile updated successfully!");
      if (onClose) onClose(); // Call onClose if it's provided
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Profile update failed!");
    }
  };

  // Display a loading message while fetching data
  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</p>;

  // --- FIX: Display an error message if the API call failed ---
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;
  
  // --- FIX: Prevent rendering the form if user data is still not available ---
  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>No profile data available.</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Update Profile ({user.role})
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Landlord extra */}
        {user.role === "landlord" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        )}

        {/* Renter extra */}
        {user.role === "renter" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <div style={{ marginTop: 10 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Emergency Contact Info</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>House Address</label>
                  <input type="text" name="houseAddress" value={formData.houseAddress} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>
              </div>
            )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            background: "#f57a88",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Save Changes
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
            background: "#fff",
            color: "#333",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
