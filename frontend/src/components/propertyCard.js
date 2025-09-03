import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function PropertyCard({ property, onWishlistToggle, isWishlisted }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'Renter') {
      alert('Only renters can add wishlist.');
      return;
    }
    onWishlistToggle(property._id);
  };

  const handleQuickBook = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`${API}/properties/${property._id}/book`, {}, { withCredentials: true });
      navigate('/dashboard/renter');
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else alert(err.response?.data?.message || 'Failed to book property.');
    }
  };

  // --- STYLES TO CREATE THE CARD LOOK ---
  const cardStyle = {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '16px',
    margin: '12px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    backgroundColor: 'white',
    fontFamily: "'Segoe UI', sans-serif",
    textDecoration: 'none', // Ensures link doesn't have underline
    color: 'inherit', // Ensures text color is inherited
    position: 'relative' // Needed for the heart button positioning
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: '8px'
  };

  const detailStyle = {
    fontSize: '0.9rem',
    color: '#555',
    margin: '4px 0'
  };

  const rentStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#f57a88',
    marginTop: '12px'
  };

  const wishlistBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isWishlisted ? 'red' : '#ccc',
  };
  // ------------------------------------

  return (
    <Link to={`/properties/${property._id}`} style={cardStyle}>
      {(!user || user.role === 'Renter') && (
        <button style={wishlistBtnStyle} onClick={handleWishlistClick}>
          ♥
        </button>
      )}
      {property.image && (
        <img
          src={`http://localhost:1629/images/${property.image}`}
          alt={property.title}
          style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
        />
      )}
      <div style={titleStyle}>{property.title}</div>
      <div style={detailStyle}><strong>Address:</strong> {property.address}</div>
      <div style={detailStyle}><strong>Bedrooms:</strong> {property.bedrooms} | <strong>Bathrooms:</strong> {property.bathrooms}</div>
      <div style={detailStyle}><strong>Landlord:</strong> {property.landlord?.name || 'N/A'}</div>
      <div style={rentStyle}>BDT {property.rent.toLocaleString()}/month</div>
      {(!(user && user._id === property.landlord?._id)) && (
        <button
          onClick={handleQuickBook}
          style={{ marginTop: '10px', padding: '8px 12px', border: 'none', borderRadius: '6px', background: '#f57a88', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
        >
          Book Now
        </button>
      )}
    </Link>
  );
}