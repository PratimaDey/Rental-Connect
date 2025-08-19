import React, { useEffect, useState } from "react";
import SidebarRenter from "../components/SidebarRenter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Messaging from "./Messaging"; // import the messaging page

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function RenterDashboard() {
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("rentDetails");
  const [loading, setLoading] = useState(true);

  const [chatWithUserId, setChatWithUserId] = useState(null);
  const [chatWithUserName, setChatWithUserName] = useState("");
  const [userList, setUserList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/auth/profile`)
      .then(res => setUser(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  // fetch all landlords to chat with
  useEffect(() => {
    if (activeComponent === "messages") {
      axios.get(`${API}/users/landlords`, { withCredentials: true })
        .then(res => setUserList(res.data))
        .catch(err => console.error("Fetch users error:", err));
    }
  }, [activeComponent]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "rentDetails":
        return <h2>Your Rent details will go here</h2>;
      case "wishlist":
        return <h2>Your Wishlist items will go here</h2>;
      case "messages":
        if (chatWithUserId) {
          // show chat
          return (
            <Messaging chatWithUserId={chatWithUserId} chatWithUserName={chatWithUserName} />
          );
        }
        // show user list to start chat
        return (
          <div>
            <h3>Select a Landlord to chat with:</h3>
            {userList.length ? (
              userList.map((u) => (
                <div
                  key={u._id}
                  style={{ padding: "10px", margin: "5px 0", cursor: "pointer", border: "1px solid #ccc", borderRadius: "5px" }}
                  onClick={() => {
                    setChatWithUserId(u._id);
                    setChatWithUserName(u.name);
                  }}
                >
                  {u.name} ({u.email})
                </div>
              ))
            ) : (
              <p>No landlords available</p>
            )}
          </div>
        );
      default:
        return <h2>Welcome Renter!</h2>;
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
