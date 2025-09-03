import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/propertyCard';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // --- 1. STATE FOR SEARCH INPUTS ---
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  // Fetches initial properties and user's wishlist
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError('');
      try {
        const [propertiesRes, wishlistRes] = await Promise.all([
          axios.get(`${API}/properties`, { withCredentials: true }),
          user ? axios.get(`${API}/users/wishlist`, { withCredentials: true }) : Promise.resolve({ data: [] })
        ]);
        setProperties(propertiesRes.data);
        // wishlistRes.data is an array of property objects (populated). Store the objects.
        setWishlist(wishlistRes.data || []);
      } catch (err) {
        console.error('HomePage fetch error:', err);
        setError('Could not fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [user]);

  // --- 2. HANDLER FOR THE SEARCH FORM ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const params = new URLSearchParams();
        if (area) params.append('area', area); // 'area' will be searched in the 'address' field on the backend
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

  const handleWishlistToggle = async (propertyId) => {
    try {
      await axios.post(`${API}/users/wishlist`, { propertyId }, { withCredentials: true });
      const wishlistRes = await axios.get(`${API}/users/wishlist`, { withCredentials: true });
      setWishlist(wishlistRes.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      console.error('Wishlist toggle error:', err);
      alert('Failed to update wishlist.');
    }
  };

  // --- STYLES (with styles for the form) ---
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

  if (loading) return <p style={{ textAlign: 'center' }}>Loading properties...</p>;

  return (
    <div style={pageStyle}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50' }}>Available Properties</h1>

      {/* --- 3. THE SEARCH FORM JSX --- */}
      <form style={searchFormStyle} onSubmit={handleSearch}>
        <input
          type="text"
          style={inputStyle}
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
      
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      
      <div style={gridStyle}>
        {properties.length > 0 ? (
          properties.map(property => (
            <PropertyCard
              key={property._id}
              property={property}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={Array.isArray(wishlist) && wishlist.some(p => p._id === property._id)}
            />
          ))
        ) : (
          !error && <p>No properties to display.</p>
        )}
      </div>
    </div>
  );
}
