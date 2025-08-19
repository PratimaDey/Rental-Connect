import React, { useEffect, useState } from "react";
import SidebarLandlord from "../components/SidebarLandlord";
import CreateAdvertisement from "../components/CreateAdvertisement";  // 👈 import
import Messaging from "./Messaging"; // 👈 import messaging component
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function LandlordDashboard() {
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("createAd");
  const [loading, setLoading] = useState(true);

  const [chatWithUserId, setChatWithUserId] = useState(null);
  const [chatWithUserName, setChatWithUserName] = useState("");
  const [userList, setUserList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/auth/profile`)
      .then((res) => setUser(res.data))
      .catch(() => navigate("/")) // redirect if not logged in
      .finally(() => setLoading(false));
  }, [navigate]);

  // fetch all renters when messages tab is active
  useEffect(() => {
    if (activeComponent === "messages") {
      axios
        .get(`${API}/users/renters`, { withCredentials: true })
        .then((res) => setUserList(res.data))
        .catch((err) => console.error("Fetch users error:", err));
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
      case "createAd":
        return <CreateAdvertisement />;
      case "rentDetails":
        return <h2>Rent details & dues table will go here</h2>;
      case "messages":
        if (chatWithUserId) {
          // show chat with selected renter
          return (
            <Messaging
              chatWithUserId={chatWithUserId}
              chatWithUserName={chatWithUserName}
            />
          );
        }
        // show list of renters to start chat
        return (
          <div>
            <h3>Select a Renter to chat with:</h3>
            {userList.length ? (
              userList.map((u) => (
                <div
                  key={u._id}
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    setChatWithUserId(u._id);
                    setChatWithUserName(u.name);
                  }}
                >
                  {u.name} ({u.email})
                </div>
              ))
            ) : (
              <p>No renters available</p>
            )}
          </div>
        );
      default:
        return <h2>Welcome Landlord!</h2>;
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50 }}>
      Loading dashboard...
    </p>;

  return (
    <div style={{ display: "flex" }}>
      <SidebarLandlord onLogout={handleLogout} onSelect={setActiveComponent} />
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
