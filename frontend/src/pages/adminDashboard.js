// In: frontend/src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1629/api";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/users`);
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users. Are you logged in as an Admin?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            try {
                await axios.delete(`${API_URL}/admin/users/${userId}`);
                fetchUsers(); // Refresh the user list
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading users...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {error}</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
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
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        style={{
                                            padding: '8px 12px', border: 'none', borderRadius: '5px',
                                            backgroundColor: '#dc3545', color: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;