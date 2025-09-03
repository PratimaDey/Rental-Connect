import React, { useEffect, useState } from "react";
import SidebarRenter from "../components/SidebarRenter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Messaging from "./Messaging"; // Feature from the second file
import UpdateProfileForm from "../components/UpdateProfileForm";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function RenterDashboard() {
  // --- MERGED STATE ---
  // All state variables from both files are now here.
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("rentDetails");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [chatWithUserId, setChatWithUserId] = useState(null);
  const [chatWithUserName, setChatWithUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMonth, setPaymentMonth] = useState('');
  const navigate = useNavigate();

  // --- MERGED DATA FETCHING ---
  // All data fetching functions and effects are combined.

  const fetchBookings = () => {
    setDataLoading(true);
    axios.get(`${API}/bookings/my`)
        .then(res => setBookings(res.data))
        .catch(err => console.error("Fetch bookings error:", err))
        .finally(() => setDataLoading(false));
  };

  const [myPayments, setMyPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const fetchMyPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await axios.get(`${API}/payments/me`, { withCredentials: true });
      setMyPayments(res.data);
    } catch (err) {
      setMyPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const fetchWishlist = () => {
    setDataLoading(true);
    axios.get(`${API}/users/wishlist`, { withCredentials: true })
        .then(res => setWishlist(res.data))
        .catch(err => {
          console.error("Fetch wishlist error:", err);
          if (err.response?.status === 401) {
            setWishlist([]);
          }
        })
        .finally(() => setDataLoading(false));
  };

  const fetchLandlords = () => {
    setDataLoading(true);
    // fetch only landlords the renter is allowed to message (i.e., those with confirmed bookings involving this renter)
    axios.get(`${API}/messages/contacts/list`, { withCredentials: true })
        .then((res) => setUserList(res.data))
        .catch((err) => console.error("Fetch contacts error:", err))
        .finally(() => setDataLoading(false));
  };

  // Remove a property from wishlist
  const handleRemoveWishlist = async (propertyId) => {
    if (!window.confirm('Remove this property from your wishlist?')) return;
    try {
      await axios.post(`${API}/users/wishlist`, { propertyId }, { withCredentials: true });
      // Re-fetch wishlist to update UI
      fetchWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      if (err.response?.status === 401) return navigate('/login');
      alert('Failed to remove item from wishlist.');
    }
  };

  useEffect(() => {
    axios.get(`${API}/auth/profile`)
      .then(res => setUser(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (activeComponent === "rentDetails") {
      fetchBookings();
      fetchMyPayments();
    } else if (activeComponent === "wishlist") {
      fetchWishlist();
    } else if (activeComponent === "messages") {
      fetchLandlords();
    }
  }, [activeComponent]);


  // --- MERGED EVENT HANDLERS ---
  // All handlers like logout, cancel booking, and update profile are here.

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
        try {
            await axios.delete(`${API}/bookings/${bookingId}`);
            fetchBookings(); // Re-fetch bookings to update the list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        }
    }
  };

  const handleUpdateProfile = () => {
    // handled via sidebar -> activeComponent
    setActiveComponent('updateProfile');
  };

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setPaymentMonth('');
    setPaymentModalOpen(true);
  };

  const submitPayment = async () => {
    if (!selectedBooking) return;
    try {
      const res = await axios.post(`${API}/payments`, { propertyId: selectedBooking.property._id, month: paymentMonth }, { withCredentials: true });
      alert('Payment successful (simulated).');
      setPaymentModalOpen(false);
  fetchMyPayments();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed.');
    }
  };

  // --- MERGED RENDERCONTENT() ---
  // The switch statement now includes the full implementations for
  // rent details, wishlist, AND messages.
  const renderContent = () => {
    if (dataLoading) return <p>Loading content...</p>;

    switch (activeComponent) {
      case "rentDetails":
        return (
          <div>
            <h2>Your Rent Details</h2>
            {bookings.length > 0 ? (
                bookings.filter(b => b.property).map(booking => (
                  <div key={booking._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', margin: '10px 0', backgroundColor: 'white' }}>
                    <h4>{booking.property.title}</h4>
                    <p><strong>Address:</strong> {booking.property.address}</p>
                    <p><strong>Landlord:</strong> {booking.landlord.name} ({booking.landlord.email})</p>
                    <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }}>{booking.status}</span></p>
                    <p style={{ fontWeight: 'bold', color: '#f57a88' }}>Monthly Rent: BDT {booking.property.rent.toLocaleString()}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={() => handleCancelBooking(booking._id)} style={{ padding: '8px 12px', border: 'none', borderRadius: '5px', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' }}>
                          Cancel Booking
                      </button>
                      <button onClick={() => openPaymentModal(booking)} style={{ padding: '8px 12px', border: 'none', borderRadius: '5px', backgroundColor: '#27ae60', color: 'white', cursor: 'pointer' }}>
                          Make Payment
                      </button>
                    </div>
                    {/* Show payment confirmation for this property if exists */}
                    {paymentsLoading ? <p>Loading payments...</p> : (
                      myPayments.filter(p => p.property && p.property._id === booking.property._id).map(p => (
                        <div key={p._id} style={{ marginTop: 10, padding: 10, border: '1px dashed #ccc', borderRadius: 6 }}>
                          {p.property?.image && (
                            <img src={`http://localhost:1629/images/${p.property.image}`} alt={p.property.title} style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 6 }} />
                          )}
                          <p style={{ margin: '8px 0' }}><strong>Payment Amount:</strong> BDT {p.amount.toLocaleString()}</p>
                          <p><strong>Paid:</strong> {p.paid ? 'Yes' : 'No'}</p>
                          <p style={{ color: p.landlordConfirmed ? '#27ae60' : '#e67e22' }}>
                            {p.landlordConfirmed ? 'Landlord confirmed receipt.' : 'Awaiting landlord confirmation.'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                ))
            ) : ( <p>You have no bookings yet.</p> )}

            {/* Payment Modal */}
            {paymentModalOpen && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 400 }}>
                  <h3>Make Payment for {selectedBooking?.property?.title}</h3>
                  <p>Amount: BDT {selectedBooking?.property?.rent?.toLocaleString()}</p>
                  <label>Select Month:</label>
                  <select value={paymentMonth} onChange={(e) => setPaymentMonth(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }}>
                    <option value="">-- Select month --</option>
                    <option value="2025-09">September 2025</option>
                    <option value="2025-10">October 2025</option>
                    <option value="2025-11">November 2025</option>
                  </select>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setPaymentModalOpen(false)} style={{ padding: '8px 12px' }}>Cancel</button>
                    <button onClick={submitPayment} style={{ padding: '8px 12px', background: '#27ae60', color: '#fff', border: 'none' }}>Proceed</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "wishlist":
        return (
          <div>
            <h2>Your Wishlist</h2>
            {wishlist.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {wishlist.map(property => (
                        <div key={property._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', width: '300px', backgroundColor: 'white' }}>
                            {property.image && (
                              <img
                                src={`http://localhost:1629/images/${property.image}`}
                                alt={property.title}
                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }}
                              />
                            )}
                            <h4>{property.title}</h4>
                            <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: property.status === 'Available' ? 'green' : 'red' }}>{property.status}</span></p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f57a88' }}>BDT {property.rent.toLocaleString()}/month</p>
                            <div style={{ marginTop: 10 }}>
                              <button onClick={() => navigate(`/properties/${property._id}`)} style={{ marginRight: 8, padding: '8px 12px', borderRadius: 6, border: 'none', background: '#2980b9', color: '#fff' }}>View</button>
                              <button onClick={() => handleRemoveWishlist(property._id)} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#c0392b', color: '#fff' }}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : ( <p>You have no items in your wishlist yet.</p> )}
          </div>
        );
      case "messages":
        if (chatWithUserId) {
          return <Messaging chatWithUserId={chatWithUserId} chatWithUserName={chatWithUserName} />;
        }
        return (
          <div>
            <h3>Select a Landlord to chat with:</h3>
            {userList.length ? (
              userList.map((u) => (
                <div key={u._id} style={{ padding: "10px", margin: "5px 0", cursor: "pointer", border: "1px solid #ccc", borderRadius: "5px" }} onClick={() => { setChatWithUserId(u._id); setChatWithUserName(u.name); }}>
                  {u.name} ({u.email})
                </div>
              ))
            ) : ( <p>No landlords available to message.</p> )}
          </div>
        );
      default:
        return <h2>Welcome, {user?.name}! Select an option from the sidebar.</h2>;
    }
  };

  // Add updateProfile case
  if (activeComponent === 'updateProfile') {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SidebarRenter onLogout={handleLogout} onSelect={setActiveComponent} />
  <div style={{ padding: "24px", flex: 1, background: "linear-gradient(135deg, #F5F5F5 30%, #F5DCE0 100%)" }}>
          <UpdateProfileForm onClose={() => setActiveComponent('rentDetails')} />
        </div>
      </div>
    );
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading dashboard...</p>;

  // --- MERGED FINAL JSX ---
  // The final returned JSX now includes the Update Profile button.
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarRenter onLogout={handleLogout} onSelect={setActiveComponent} />
  <div style={{ padding: "24px", flex: 1, position: "relative", background: "linear-gradient(135deg, #F5F5F5 30%, #F5DCE0 100%)" }}>
        {user && (
          <div style={{ marginBottom: '20px' }}>
            <h2>Welcome, {user.name}</h2>
            <p>Role: {user.role}</p>
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}