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
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/auth/profile`)
      .then(res => setUser(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const fetchBookings = () => {
    setBookingsLoading(true);
    axios.get(`${API}/bookings/my`)
        .then(res => setBookings(res.data))
        .catch(err => console.error("Fetch bookings error:", err))
        .finally(() => setBookingsLoading(false));
  }

  useEffect(() => {
    if (activeComponent === "rentDetails") {
        fetchBookings();
    }
  }, [activeComponent]);

  const handleLogout = async () => { /* ... */ };

  // --- ADD THIS NEW FUNCTION ---
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
        try {
            await axios.delete(`${API}/bookings/${bookingId}`);
            // Refresh the bookings list after cancellation
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        }
    }
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "rentDetails":
        if (bookingsLoading) return <p>Loading your bookings...</p>;
        return (
            <div>
                <h2>Your Rent Details</h2>
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', margin: '10px 0' }}>
                            <h4>{booking.property.title}</h4>
                            <p><strong>Address:</strong> {booking.property.address}</p>
                            <p><strong>Rent:</strong> BDT {booking.property.rent.toLocaleString()}/month</p>
                            <p><strong>Landlord:</strong> {booking.landlord.name} ({booking.landlord.email})</p>
                            <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }}>{booking.status}</span></p>
                            {/* --- ADD THIS BUTTON --- */}
                            <button 
                                onClick={() => handleCancelBooking(booking._id)}
                                style={{
                                    marginTop: '10px', padding: '8px 12px', border: 'none',
                                    borderRadius: '5px', backgroundColor: '#6c757d',
                                    color: 'white', cursor: 'pointer'
                                }}
                            >
                                Cancel Booking
                            </button>
                        </div>
                    ))
                ) : ( <p>You have no bookings yet.</p> )}
            </div>
        );
      case "wishlist": return <h2>Your Wishlist items will go here</h2>;
      case "messages": return <h2>Your messages will go here</h2>;
      default: return <h2>Welcome Renter!</h2>;
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