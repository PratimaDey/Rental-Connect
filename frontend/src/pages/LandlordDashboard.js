import React, { useEffect, useState, useCallback } from "react";
import SidebarLandlord from "../components/SidebarLandlord";
import CreateAdvertisement from "../components/CreateAdvertisement";
import Messaging from "./Messaging";
import MyAdvertisements from "../components/MyAdvertisements";
import LandlordAnalytics from "../components/LandlordAnalytics";
import UpdateProfileForm from "../components/UpdateProfileForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function LandlordDashboard() {
  // --- MERGED STATE ---
  // Contains all state from both versions for all features.
  const [user, setUser]                   = useState(null);
  const [activeComponent, setActiveComponent] = useState("createAd");
  const [loading, setLoading]             = useState(true);
  const [chatWithUserId, setChatWithUserId] = useState(null);
  const [chatWithUserName, setChatWithUserName] = useState("");
  const [userList, setUserList]           = useState([]);
  const [myAds, setMyAds]                 = useState([]);
  const [adsLoading, setAdsLoading]       = useState(false);
  const [updateData, setUpdateData]       = useState({ name: "", email: "", phone: "" });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [landlordPayments, setLandlordPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  // Fetch pending bookings for landlord
  const fetchPendingBookings = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await axios.get(`${API}/bookings/landlord-pending`, { withCredentials: true });
      setPendingBookings(res.data);
    } catch (err) {
      setPendingBookings([]);
    } finally {
      setPendingLoading(false);
    }
  }, []);
  
  // FIX: Using the useNavigate hook for navigation, which is better practice.
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/auth/profile`)
      .then((res) => {
        setUser(res.data);
        setUpdateData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || "",
        });
      })
      .catch(() => navigate("/")) // Using navigate instead of window.location
      .finally(() => setLoading(false));
  }, [navigate]);

  const fetchLandlordPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await axios.get(`${API}/payments/landlord`, { withCredentials: true });
      setLandlordPayments(res.data);
    } catch (err) {
      setLandlordPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const fetchMyAds = useCallback(async () => {
    setAdsLoading(true);
    try {
      const res = await axios.get(`${API}/properties/my`, { withCredentials: true });
      setMyAds(res.data);
    } catch (err) {
      console.error("Failed to fetch my advertisements:", err);
      setMyAds([]);
    } finally {
      setAdsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeComponent === "messages") {
      // fetch only renters who have confirmed bookings for this landlord
      axios
        .get(`${API}/messages/contacts/list`, { withCredentials: true })
        .then((res) => setUserList(res.data))
        .catch((err) => console.error("Fetch contacts error:", err));
    } else if (activeComponent === "myAds") {
      fetchMyAds();
    } else if (activeComponent === "bookingApproval") {
      fetchPendingBookings();
    } else if (activeComponent === "rentDetails") {
      // fetch payments for landlord to confirm
      fetchLandlordPayments();
    }
  }, [activeComponent, fetchMyAds, fetchPendingBookings]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      navigate("/"); // Using navigate for a clean redirect
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Note: update handled by UpdateProfileForm when activeComponent === 'updateProfile'
  const renderContent = () => {
    // The complete switch statement with all features.
    switch (activeComponent) {
      case "createAd": return <CreateAdvertisement onCreated={fetchMyAds} />;
      case "myAds": return <MyAdvertisements ads={myAds} loading={adsLoading} refresh={fetchMyAds} />;
      case "bookingApproval":
        // Approve/Reject handlers
        const handleApprove = async (bookingId) => {
          try {
            await axios.patch(`${API}/bookings/${bookingId}/approve`, {}, { withCredentials: true });
            fetchPendingBookings();
          } catch (err) {
            alert('Failed to approve booking.');
          }
        };
        const handleReject = async (bookingId) => {
          try {
            await axios.patch(`${API}/bookings/${bookingId}/reject`, {}, { withCredentials: true });
            fetchPendingBookings();
          } catch (err) {
            alert('Failed to reject booking.');
          }
        };
        return (
          <div>
            <h2>Booking Approval</h2>
            {pendingLoading ? (
              <p>Loading pending bookings...</p>
            ) : pendingBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {pendingBookings.map(booking => (
                  <div key={booking._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white' }}>
                    <h4>{booking.property?.title}</h4>
                    <p><strong>Renter:</strong> {booking.renter?.name} ({booking.renter?.email})</p>
                    <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: booking.status === 'Pending' ? 'orange' : 'green' }}>{booking.status}</span></p>
                    <p><strong>Requested At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                    <div style={{ marginTop: '10px' }}>
                      <button
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#27ae60', color: 'white', fontWeight: 'bold', marginRight: '10px', cursor: 'pointer' }}
                        onClick={() => handleApprove(booking._id)}
                        disabled={booking.status !== 'Pending'}
                      >
                        Approve
                      </button>
                      <button
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#c0392b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => handleReject(booking._id)}
                        disabled={booking.status !== 'Pending'}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No pending bookings for approval.</p>
            )}
          </div>
        );
      case "rentDetails": {
        const handleConfirm = async (paymentId) => {
          try {
            await axios.patch(`${API}/payments/${paymentId}/confirm`, {}, { withCredentials: true });
            fetchLandlordPayments();
          } catch (err) {
            alert('Failed to confirm payment.');
          }
        };

        return (
          <div>
            <h2>Rent Details & Dues</h2>
            {paymentsLoading ? <p>Loading payments...</p> : (
              landlordPayments.length ? (
                landlordPayments.map(p => (
                  <div key={p._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, margin: '8px 0', background: 'white' }}>
                    <h4>{p.property?.title}</h4>
                    <p><strong>Renter:</strong> {p.renter?.name} ({p.renter?.email})</p>
                    <p><strong>Amount:</strong> BDT {p.amount.toLocaleString()}</p>
                    <p><strong>Paid:</strong> {p.paid ? 'Yes' : 'No'}</p>
                    <p><strong>Landlord Confirmed:</strong> {p.landlordConfirmed ? 'Yes' : 'No'}</p>
                    {!p.landlordConfirmed && p.paid && (
                      <button onClick={() => handleConfirm(p._id)} style={{ padding: '8px 12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6 }}>Confirm Received</button>
                    )}
                  </div>
                ))
              ) : (
                <p>No payments found.</p>
              )
            )}
          </div>
        );
      }
      case "analytics": return <LandlordAnalytics />;
      case "updateProfile":
        return <UpdateProfileForm onClose={() => setActiveComponent('createAd')} />;
      case "messages":
        if (chatWithUserId) {
          return <Messaging chatWithUserId={chatWithUserId} chatWithUserName={chatWithUserName} />;
        }
        return (
          <div>
            <h3>Select a Renter to chat with:</h3>
            {userList.length ? (
              userList.map((u) => (
                <div key={u._id} style={{ padding: "10px", margin: "5px 0", cursor: "pointer", border: "1px solid #ccc", borderRadius: "5px" }} onClick={() => { setChatWithUserId(u._id); setChatWithUserName(u.name); }}>
                  {u.name} ({u.email})
                </div>
              ))
            ) : ( <p>No renters available</p> )}
          </div>
        );
      default: return <h2>Welcome Landlord! Select an option from the sidebar.</h2>;
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading dashboard...</p>;

  // The final JSX with the Update Profile button.
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarLandlord onLogout={handleLogout} onSelect={setActiveComponent} />
  <div style={{ padding: "24px", flex: 1, position: "relative", background: "linear-gradient(135deg, #F5F5F5 30%, #F5DCE0 100%)" }}>
  {/* Update Profile moved to sidebar */}
  {user && activeComponent !== 'updateProfile' && (
          <>
            <h2>Welcome, {user.name}</h2>
            <p>Role: {user.role}</p>
          </>
        )}
        {/* Wrap content area so specific sections can adopt card-grid layouts */}
        <div style={{ marginTop: 12 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

