import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth to check the user's role

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the currently logged-in user

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`${API}/properties/${id}`);
        setProperty(data);
      } catch (err) {
        setError('Could not fetch property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

const handleBooking = async () => {
    try {
        await axios.post(`${API}/properties/${id}/book`, {}, { withCredentials: true });
        
        // On success, show an alert and then redirect
        alert('Booking successful! You will now be taken to your dashboard.');
        navigate('/dashboard/renter'); // <-- REDIRECTS HERE

    } catch (err) {
        if (err.response?.status === 401) {
            navigate('/login');
        } else {
            setBookingMessage(err.response?.data?.message || 'Booking failed.');
        }
    }
};

  // Inline styles
  const pageStyle = { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: "'Segoe UI', sans-serif" };
  const cardStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const buttonStyle = { padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '8px', color: 'white', backgroundColor: '#f57a88', marginTop: '20px' };

  if (loading) return <p style={pageStyle}>Loading details...</p>;
  if (error) return <p style={{ ...pageStyle, color: 'red' }}>{error}</p>;
  if (!property) return null;

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#2C3E50' }}>{property.title}</h1>
        <p><strong>Address:</strong> {property.address}</p>
        <p><strong>Description:</strong> {property.description || 'No description provided.'}</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
        <p><strong>Available From:</strong> {new Date(property.availableFrom).toLocaleDateString()}</p>
        <p><strong>Landlord:</strong> {property.landlord?.name} ({property.landlord?.email})</p>
        <h2 style={{ color: '#f57a88', marginTop: '20px' }}>BDT {property.rent.toLocaleString()}/month</h2>
        
        {/* Logic to show button only to Renters who are not the landlord */}
        {user && user.role === 'Renter' && user._id !== property.landlord._id && (
            <button style={buttonStyle} onClick={handleBooking}>Book Now</button>
        )}

        {bookingMessage && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{bookingMessage}</p>}
      </div>
    </div>
  );
}