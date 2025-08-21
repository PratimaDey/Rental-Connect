import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

export default function PropertyCard({ property }) {
  // ... (your style objects remain the same)
  const cardStyle = {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '16px',
    margin: '12px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    backgroundColor: 'white',
    fontFamily: "'Segoe UI', sans-serif"
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

  return (
    // 2. Wrap the entire card content in a Link component
    <Link to={`/properties/${property._id}`} style={{ textDecoration: 'none' }}>
      <div style={cardStyle}>
        <div style={titleStyle}>{property.title}</div>
        <div style={detailStyle}><strong>Address:</strong> {property.address}</div>
        <div style={detailStyle}><strong>Bedrooms:</strong> {property.bedrooms} | <strong>Bathrooms:</strong> {property.bathrooms}</div>
        <div style={detailStyle}><strong>Landlord:</strong> {property.landlord?.name || 'N/A'}</div>
        <div style={rentStyle}>BDT {property.rent.toLocaleString()}/month</div>
      </div>
    </Link>
  );
}