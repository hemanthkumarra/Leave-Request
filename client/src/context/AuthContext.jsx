import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored authentication state on load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const loadToast = toast.loading('Signing in...');
    try {
      const response = await api.post('/auth/login', { usernameOrEmail, password });
      const { token: jwtToken, username, email, role, phoneNumber } = response.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify({ username, email, role, phoneNumber }));

      setToken(jwtToken);
      setUser({ username, email, role, phoneNumber });
      toast.success(`Welcome back, ${username}!`, { id: loadToast });
      return { success: true, role };
    } catch (error) {
      const message = error.response?.data || 'Invalid credentials. Please try again.';
      toast.error(typeof message === 'string' ? message : 'Login failed', { id: loadToast });
      return { success: false, error: message };
    }
  };

  const signup = async (username, email, password, role, phoneNumber) => {
    const loadToast = toast.loading('Creating account...');
    try {
      const response = await api.post('/auth/signup', { username, email, password, role, phoneNumber });
      const { token: jwtToken, username: resUser, email: resEmail, role: resRole, phoneNumber: resPhone } = response.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify({ username: resUser, email: resEmail, role: resRole, phoneNumber: resPhone }));

      setToken(jwtToken);
      setUser({ username: resUser, email: resEmail, role: resRole, phoneNumber: resPhone });
      toast.success(`Account created! Welcome, ${resUser}!`, { id: loadToast });
      return { success: true, role: resRole };
    } catch (error) {
      const message = error.response?.data || 'Registration failed. Please check inputs.';
      toast.error(typeof message === 'string' ? message : 'Signup failed', { id: loadToast });
      return { success: false, error: message };
    }
  };

  const updateProfile = async (profileData) => {
    const loadToast = toast.loading('Updating profile...');
    try {
      const response = await api.put('/auth/profile', profileData);
      const { token: jwtToken, username, email, role, phoneNumber } = response.data;

      if (jwtToken) {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
      }
      localStorage.setItem('user', JSON.stringify({ username, email, role, phoneNumber }));
      setUser({ username, email, role, phoneNumber });

      toast.success('Profile updated successfully!', { id: loadToast });
      return { success: true };
    } catch (error) {
      const message = error.response?.data || 'Profile update failed.';
      toast.error(typeof message === 'string' ? message : 'Profile update failed', { id: loadToast });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
