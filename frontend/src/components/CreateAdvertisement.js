import React, { useState } from "react";
import axios from "axios";

export default function CreateAdvertisement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [rent, setRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [message, setMessage] = useState(null); // for success or error
  const [messageType, setMessageType] = useState("success"); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !address || !rent || !bedrooms || !bathrooms || !availableFrom) {
      setMessage("Please fill all required fields!");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1629/api/properties",
        {
          title,
          description,
          address,
          rent: Number(rent),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          availableFrom,
        },
        { withCredentials: true }
      );

      setMessage("🎉 Advertisement created successfully!");
      setMessageType("success");
      console.log("Property created:", response.data);

      // Reset form
      setTitle("");
      setDescription("");
      setAddress("");
      setRent("");
      setBedrooms("");
      setBathrooms("");
      setAvailableFrom("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to create advertisement");
      setMessageType("error");
      console.error("Create property error:", err);
    }
  };

  // Inline styles
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
    margin: "20px auto",
    padding: "25px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px"
  };

  const buttonStyle = {
    padding: "14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2C3E50",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  };

  const messageStyle = {
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold",
    color: messageType === "success" ? "#155724" : "#721c24",
    backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
    border: messageType === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2C3E50" }}>
        🏡 Create Property Advertisement
      </h2>

      {message && <div style={messageStyle}>{message}</div>}

      <input
        style={inputStyle}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        style={inputStyle}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        style={inputStyle}
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="number"
        placeholder="Rent (BDT)"
        value={rent}
        onChange={(e) => setRent(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="number"
        placeholder="Bedrooms"
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="number"
        placeholder="Bathrooms"
        value={bathrooms}
        onChange={(e) => setBathrooms(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="date"
        placeholder="Available From"
        value={availableFrom}
        onChange={(e) => setAvailableFrom(e.target.value)}
        required
      />

      <button
        style={{
          ...buttonStyle,
          backgroundColor: "#2C3E50",
        }}
        type="submit"
        onMouseOver={(e) => (e.target.style.backgroundColor = "#34495E")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2C3E50")}
      >
        Create Advertisement
      </button>
    </form>
  );
}
