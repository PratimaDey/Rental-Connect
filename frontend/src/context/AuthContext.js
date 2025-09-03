import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Ensure axios includes credentials for session-based auth across the app
axios.defaults.withCredentials = true;

const API = process.env.REACT_APP_API_URL || "http://localhost:1629/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/auth/profile`)
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await axios.post(`${API}/auth/logout`);
        setUser(null);
    };

    const value = { user, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};