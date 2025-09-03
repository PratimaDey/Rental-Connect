import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function Messaging({ chatWithUserId, chatWithUserName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // get logged-in user
    axios.get(`${API}/auth/profile`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!chatWithUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API}/messages/${chatWithUserId}`, { withCredentials: true });
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatWithUserId]);

  const handleSend = async () => {
     if (!chatWithUserId || !newMessage.trim()) {
    alert("Please select a user and type a message.");
    return;
  }
  try {
    const response = await axios.post(
      `${API}/messages`,
      {
        to: chatWithUserId,
        content: newMessage,
      },
      { withCredentials: true }
    );

      console.log("Sent message:", response.data);
      setMessages(prev => [...prev, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3>Chat with {chatWithUserName}</h3>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", height: "400px", overflowY: "auto", padding: "10px", marginBottom: "10px" }}>
        {messages.map((m) => (
          <div key={m._id} style={{ margin: "5px 0", textAlign: m.sender === user._id ? "right" : "left" }}>
            <span style={{ background: m.sender === user._id ? "#D1F2EB" : "#FADBD8", padding: "6px 10px", borderRadius: "10px", display: "inline-block" }}>
              {m.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          style={{ marginLeft: "8px", padding: "8px 12px", borderRadius: "6px", background: "#2C3E50", color: "#fff", border: "none" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
