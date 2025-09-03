import React from "react";
import axios from "axios";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RenterDashboard from "./pages/RenterDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import AdminDashboard from "./pages/adminDashboard";
import HomePage from "./pages/HomePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

axios.defaults.withCredentials = true;

function LayoutWrapper({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #F5F5F5 30%, #F5DCE0 100%)",
  };

  return (
    <div style={pageStyle}>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/renter" element={<RenterDashboard />} />
          <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
        </Routes>
      </LayoutWrapper>
    </div>
  );
}

export default App;

