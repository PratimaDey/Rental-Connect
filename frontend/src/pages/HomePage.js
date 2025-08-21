import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/propertyCard';

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API}/properties`);
      setProperties(data);
    } catch (err) {
      setError('Could not fetch properties. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const params = new URLSearchParams();
        if (area) params.append('area', area);
        if (bedrooms) params.append('bedrooms', bedrooms);

        const { data } = await axios.get(`${API}/properties/search?${params.toString()}`);
        setProperties(data);
        if (data.length === 0) {
            setError('No properties found matching your criteria.');
        }
    } catch (err) {
        setError('Search failed. Please try again.');
        setProperties([]);
    } finally {
        setLoading(false);
    }
  };

  const pageStyle = { maxWidth: '1200px', margin: '20px auto', padding: '20px' };
  const gridStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' };
  const searchFormStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
  };
  const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' };
  const buttonStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#f57a88', color: 'white', cursor: 'pointer', fontWeight: 'bold' };

  return (
    <div style={pageStyle}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50' }}>Available Properties</h1>

      <form style={searchFormStyle} onSubmit={handleSearch}>
        <input
          type="text"
          style={inputStyle}
          // --- THIS IS THE CORRECTED PLACEHOLDER ---
          placeholder="Search by Address"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          type="number"
          style={inputStyle}
          placeholder="Number of Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          min="1"
        />
        <button type="submit" style={buttonStyle}>Search</button>
      </form>
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading properties...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <div style={gridStyle}>
          {properties.length > 0 ? (
            properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <p>No properties to display.</p>
          )}
        </div>
      )}
    </div>
  );
}