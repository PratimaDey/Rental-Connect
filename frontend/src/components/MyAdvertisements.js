// components/MyAdvertisements.js
import React, { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function MyAdvertisements({ ads = [], loading = false, refresh }) {
  const [deletingId, setDeletingId] = useState(null);
  // --- NEW --- Add state to track which ad's status is being updated
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement? This action cannot be undone.")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${API}/properties/${id}`, { withCredentials: true });
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete. Check console for details.");
    } finally {
      setDeletingId(null);
    }
  };

  // --- NEW --- Function to handle toggling the availability status
  const handleToggleStatus = async (id, currentStatus) => {
    // Determine the new status
    const newStatus = currentStatus === "Available" ? "Unavailable" : "Available";

    if (!window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)) return;

    try {
      setUpdatingStatusId(id);
      // Make a PATCH request to a new backend endpoint
      await axios.patch(`${API}/properties/${id}/status`, 
        { status: newStatus }, // Send the new status in the request body
        { withCredentials: true }
      );
      // Refresh the list to show the updated status
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Check console for details.");
    } finally {
      setUpdatingStatusId(null);
    }
  };


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Advertisements</h2>
        <div>
          <button
            onClick={refresh}
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

      {loading ? (
        <p>Loading your advertisements...</p>
      ) : ads.length === 0 ? (
        <p>No advertisements found. Create an advertisement to get started.</p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {ads.map((ad) => (
            <div
              key={ad._id}
              style={{
                border: '1px solid #e6e0e4',
                borderRadius: 10,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {/* Image at the top */}
              {ad.image ? (
                <div style={{ width: '100%', height: 160, overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                  <img src={`http://localhost:1629/images/${ad.image}`} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ) : (
                <div style={{ width: '100%', height: 160, background: '#f2f2f2', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
              )}

              {/* Content */}
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ margin: 0 }}>{ad.title}</h3>
                <p style={{ margin: '4px 0', color: '#666' }}>{ad.address}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <p style={{ margin: 0 }}>Rent: <strong>BDT {ad.rent}</strong></p>
                  <p style={{ margin: 0 }}>Beds: {ad.bedrooms} | Baths: {ad.bathrooms}</p>
                </div>
                <p style={{ margin: 0, color: '#888' }}>Available from: {ad.availableFrom ? new Date(ad.availableFrom).toLocaleDateString() : 'N/A'}</p>
                <p style={{ margin: '6px 0 0', fontWeight: 'bold' }}>Status: <span style={{ color: ad.status === 'Available' ? '#2ecc71' : '#e74c3c' }}>{ad.status || 'N/A'}</span></p>
              </div>

              {/* Actions pinned to bottom inside the same card */}
              <div style={{ padding: 12, borderTop: '1px solid #f0ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#888' }}>Created: {new Date(ad.createdAt).toLocaleDateString()}</small>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleToggleStatus(ad._id, ad.status)}
                    disabled={updatingStatusId === ad._id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #3498db',
                      background: updatingStatusId === ad._id ? '#d6eaf8' : '#fff',
                      cursor: updatingStatusId === ad._id ? 'not-allowed' : 'pointer',
                      color: '#3498db',
                      fontWeight: 600
                    }}
                    title="Change availability status"
                  >
                    {updatingStatusId === ad._id ? 'Updating...' : (ad.status === 'Available' ? 'Mark Unavailable' : 'Mark Available')}
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    disabled={deletingId === ad._id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #e74c3c',
                      background: deletingId === ad._id ? '#f8d7da' : '#fff',
                      cursor: deletingId === ad._id ? 'not-allowed' : 'pointer',
                      color: '#e74c3c',
                      fontWeight: 600
                    }}
                    title="Delete advertisement"
                  >
                    {deletingId === ad._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
