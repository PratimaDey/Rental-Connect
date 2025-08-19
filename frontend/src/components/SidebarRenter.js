
import React from "react";

export default function SidebarRenter({ onLogout, onSelect }) {
  const menuStyle = {
    background: "#2C3E50",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    width: "240px",
    display: "flex",
    flexDirection: "column",
  };

  const buttonStyle = {
    padding: "10px 14px",
    margin: "8px 0",
    border: "none",
    borderRadius: "6px",
    background: "#34495E",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
  };

  const logoutStyle = {
    ...buttonStyle,
    marginTop: "auto",
    background: "#E74C3C",
  };

  return (
    <div style={menuStyle}>
      <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>Renter</h2>
      <button style={buttonStyle} onClick={() => onSelect("rentDetails")}>
        📄 Rent Details
      </button>
      <button style={buttonStyle} onClick={() => onSelect("wishlist")}>
        ❤️ Wishlist
      </button>
      <button style={buttonStyle} onClick={() => onSelect("messages")}>
        💬 Messages
      </button>
      <button style={logoutStyle} onClick={onLogout}>
        🚪 Logout
      </button>
    </div>
  );
}
