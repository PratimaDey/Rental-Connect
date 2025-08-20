import React from "react";
import axios from "axios";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
import RenterDashboard from "./pages/RenterDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import AdminDashboard from "./pages/adminDashboard";
import ProfileUpdate from "./pages/ProfileUpdate";
import Advertisements from "./pages/Advertisements";
import AdvertisementDetails from "./pages/AdvertisementDetails";




axios.defaults.withCredentials = true;

function App() {
  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #F5F5F5 30%, #F5DCE0 100%)"
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/profileupdate" element={<ProfileUpdate />} />
        <Route path="/advertisements" element={<Advertisements />} />
        <Route path="/:id" element={<AdvertisementDetails />} />
        <Route path="/dashboard/admin" element={<AdminDashboard/>}/>
        <Route path="/dashboard/renter" element={<RenterDashboard />} />
        <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
        
      </Routes>
    </div>
  );
}

export default App;
