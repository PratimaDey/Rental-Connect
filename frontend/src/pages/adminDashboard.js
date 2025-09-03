import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [reportedProperties, setReportedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, propertiesRes] = await Promise.all([
                axios.get(`${API_URL}/admin/users`, { withCredentials: true }),
                axios.get(`${API_URL}/admin/properties/reported`, { withCredentials: true })
            ]);
            setUsers(usersRes.data);
            setReportedProperties(propertiesRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data. Are you logged in as an Admin?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_URL}/admin/users/${userId}`, { withCredentials: true });
                fetchData(); // Refetch all data to update lists
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (window.confirm('Are you sure you want to permanently delete this property advertisement?')) {
            try {
                await axios.delete(`${API_URL}/admin/properties/${propertyId}`, { withCredentials: true });
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete property.');
            }
        }
    };
    
    const handleDismissReport = async (propertyId) => {
        if (window.confirm('Are you sure you want to dismiss this report? The property will no longer be marked as reported.')) {
            try {
                await axios.put(`${API_URL}/admin/properties/${propertyId}/dismiss`, {}, { withCredentials: true });
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to dismiss report.');
            }
        }
    };
    
    const actionButtonStyle = {
        padding: '8px 12px', 
        border: 'none', 
        borderRadius: '5px',
        color: 'white', 
        cursor: 'pointer',
        margin: '0 4px',
    };
    const deleteButtonStyle = { ...actionButtonStyle, backgroundColor: '#c0392b' };
    const dismissButtonStyle = { ...actionButtonStyle, backgroundColor: '#7f8c8d' };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard data...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {error}</p>;

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2C3E50' }}>Admin Dashboard</h1>
            
            {/* --- FIX: ADDED THE USER MANAGEMENT TABLE BACK IN --- */}
            <h2 style={{ marginTop: '40px' }}>User Management</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333', backgroundColor: '#f7f7f7' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>{user.name}</td>
                            <td style={{ padding: '12px' }}>{user.email}</td>
                            <td style={{ padding: '12px' }}>{user.role}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                {user.role !== 'Admin' && (
                                    <button onClick={() => handleDeleteUser(user._id)} style={deleteButtonStyle}>
                                        Delete User
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- Reported Advertisements Table --- */}
            <h2 style={{ marginTop: '60px', borderTop: '2px solid #eee', paddingTop: '30px' }}>Reported Advertisements</h2>
            {reportedProperties.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333', backgroundColor: '#f7f7f7' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Landlord</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '40%' }}>Reason for Report</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportedProperties.map((prop) => (
                            <tr key={prop._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{prop.title}</td>
                                <td style={{ padding: '12px' }}>{prop.landlord?.name || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>
                                    {prop.reportDetails?.reason || 'No reason provided.'}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button onClick={() => handleDismissReport(prop._id)} style={dismissButtonStyle}>
                                        Dismiss
                                    </button>
                                    <button onClick={() => handleDeleteProperty(prop._id)} style={deleteButtonStyle}>
                                        Delete Ad
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No reported advertisements to show.</p>
            )}
        </div>
    );
};

export default AdminDashboard;
