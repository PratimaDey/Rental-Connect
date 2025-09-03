
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // FIX 1: Wrapped fetchProperty in useCallback to fix the useEffect dependency warning.
  const fetchProperty = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/properties/${id}`);
      setProperty(data);
      // Check if wishlisted (only for renters)
      if (user && user.role === 'Renter') {
        const wishlistRes = await axios.get(`${API}/users/wishlist`);
        setIsWishlisted(wishlistRes.data.some(p => p._id === data._id));
      }
    } catch (err) {
      setError('Could not fetch property details.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // Wishlist handler
  const handleWishlist = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
  await axios.post(`${API}/users/wishlist`, { propertyId: property._id }, { withCredentials: true });
  const wishlistRes = await axios.get(`${API}/users/wishlist`, { withCredentials: true });
  const ids = (wishlistRes.data || []).map(p => p._id);
  setIsWishlisted(ids.includes(property._id));
    } catch (err) {
      if (err.response?.status === 401) return navigate('/login');
      console.error('Wishlist error:', err);
      alert('Failed to update wishlist.');
    }
  };

  // FIX 3: Re-implemented the full handleBooking function.
  const handleBooking = async () => {
    try {
        await axios.post(`${API}/properties/${id}/book`, {}, { withCredentials: true });
        alert('Booking successful! You will now be taken to your dashboard.');
        navigate('/dashboard/renter');
    } catch (err) {
        if (err.response?.status === 401) {
            navigate('/login'); // This now uses 'navigate'
        } else {
            setBookingMessage(err.response?.data?.message || 'Booking failed.'); // This now uses 'setBookingMessage'
        }
    }
  };

  // FIX 4: Re-implemented the full handleCommentSubmit function.
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
        await axios.post(`${API}/properties/${id}/comments`, { text: commentText }, { withCredentials: true });
        setCommentText(''); // This now uses 'setCommentText'
        fetchProperty(); // Refresh property details to show the new comment
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to post comment.');
    }
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };
  
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      alert('Please provide a reason for the report.');
      return;
    }
    try {
      const { data } = await axios.post(
        `${API}/properties/${id}/report`, 
        { reason: reportReason },
        { withCredentials: true }
      );
      setReportMessage(data.message);
      setIsReportModalOpen(false);
      setReportReason('');
      fetchProperty();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report property.');
    }
  };

  // --- Styles ---
  const pageStyle = { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: "'Segoe UI', sans-serif" };
  const cardStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const buttonStyle = { padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '8px', color: 'white', backgroundColor: '#f57a88', marginTop: '20px' };
  const reportButtonStyle = { ...buttonStyle, backgroundColor: '#c0392b', marginLeft: '10px' };
  const commentSectionStyle = { marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' };
  const commentInputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' };
  const commentButtonStyle = { padding: '8px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#34495E', color: 'white', cursor: 'pointer' };
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContentStyle = { background: 'white', padding: '25px', borderRadius: '10px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };
  const modalTextAreaStyle = { width: '100%', minHeight: '100px', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', margin: '10px 0' };
  const modalButtonStyle = { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' };

  if (loading) return <p style={pageStyle}>Loading details...</p>;
  if (error) return <p style={{ ...pageStyle, color: 'red' }}>{error}</p>;
  if (!property) return null;

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* --- Property Image --- */}
        {property.image && (
          <img
            src={`http://localhost:1629/images/${property.image}`}
            alt={property.title}
            style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '8px', marginBottom: '18px' }}
          />
        )}
        {/* --- Property Details --- */}
        <h1 style={{ color: '#2C3E50' }}>{property.title}</h1>
        <p><strong>Address:</strong> {property.address}</p>
        <p><strong>Description:</strong> {property.description || 'No description provided.'}</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
        <p><strong>Available From:</strong> {new Date(property.availableFrom).toLocaleDateString()}</p>
        <p><strong>Landlord:</strong> {property.landlord?.name} ({property.landlord?.email})</p>
        <h2 style={{ color: '#f57a88', marginTop: '20px' }}>BDT {property.rent.toLocaleString()}/month</h2>

        {/* --- Action Buttons --- */}
        <div>
          {user && user.role === 'Renter' && user._id !== property.landlord._id && (
            <button style={buttonStyle} onClick={handleBooking}>Book Now</button>
          )}
          {user && user.role === 'Renter' && (
            <button style={reportButtonStyle} onClick={handleReportClick} disabled={property.reportDetails}>
              {property.reportDetails ? 'Reported' : 'Report Ad'}
            </button>
          )}
          {user && user.role === 'Renter' && (
            <button
              style={{ ...buttonStyle, backgroundColor: isWishlisted ? '#27ae60' : '#2980b9', marginLeft: '10px' }}
              onClick={handleWishlist}
            >
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
          )}
        </div>
        {bookingMessage && <p>{bookingMessage}</p>}
        {reportMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{reportMessage}</p>}

        {/* --- FIX 5: Re-implemented the entire Comments Section --- */}
        <div style={commentSectionStyle}>
            <h3>Comments ({property.comments.length})</h3>
            {user && user.role === 'Renter' && (
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        style={commentInputStyle}
                        rows="3"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" style={commentButtonStyle}>Post Comment</button>
                </form>
            )}
            <div style={{ marginTop: '20px' }}>
                {property.comments.map((comment, index) => (
                    <div key={index} style={{ borderBottom: '1px solid #f0f0f0', padding: '10px 0' }}>
                        <p><strong>{comment.name}</strong> <span style={{ color: '#888', fontSize: '12px' }}>on {new Date(comment.createdAt).toLocaleDateString()}</span></p>
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- Report Modal --- */}
      {isReportModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Report Advertisement</h2>
            <p>Please provide a reason for reporting this property.</p>
            <form onSubmit={handleReportSubmit}>
              <textarea
                style={modalTextAreaStyle}
                placeholder="e.g., The information is inaccurate, this seems like a scam, etc."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
              />
              <div style={{ textAlign: 'right', marginTop: '15px' }}>
                <button type="button" style={{ ...modalButtonStyle, backgroundColor: '#ccc' }} onClick={() => setIsReportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" style={{ ...modalButtonStyle, backgroundColor: '#c0392b', color: 'white' }}>
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
