import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem('swerrv_token');
        if (token) {
            try {
                // Here we decode JWT or fetch user details.
                // Depending on the backend, we might just use the token payload
                // Or call an auth/me endpoint
                const userData = await api.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('swerrv_token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email, password) => {
        try {
            const data = await api.login(email, password);
            localStorage.setItem('swerrv_token', data.accessToken || data.token);
            // The AuthResponse is flat (data.userId, data.email, data.role)
            setUser(data);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            await api.register(userData);
            toast.success('Registration successful! Please login.');
            return true;
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            return false;
        }
    };

    const googleLogin = async (googleToken) => {
        try {
            const data = await api.googleLogin(googleToken);
            localStorage.setItem('swerrv_token', data.accessToken || data.token);
            setUser(data);
            toast.success('Signed in with Google!');
            return true;
        } catch (error) {
            toast.error(error.message || 'Google sign-in failed');
            return false;
        }
    };

    const updateUserProfile = async (profileData) => {
        try {
            const data = await api.updateProfile(profileData);
            if (data.accessToken) {
                localStorage.setItem('swerrv_token', data.accessToken);
            }
            setUser(data);
            toast.success('Profile updated successfully!');
            return true;
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('swerrv_token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, googleLogin, updateUserProfile, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
