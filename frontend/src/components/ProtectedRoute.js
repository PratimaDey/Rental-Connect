
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userData.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
