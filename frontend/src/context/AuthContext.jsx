import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token and get user info
        const res = await authService.getMe();
        // backend returns { user: { ... } }
        setUser(res.user || null);
      } catch (err) {
        // invalid token or error - clear stored token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (credentials) => {
    // credentials is expected to be { email, password }
    try {
      const data = await authService.login(credentials.email, credentials.password);
      // authService stores token and user in localStorage already
      const user = data.user || authService.getCurrentUser();
      setUser(user || null);
      return { success: true };
    } catch (err) {
      console.error('Login failed', err);
      return { success: false, error: err };
    }
  };

  const logout = () => {
    try {
      authService.logout();
    } catch (e) {
      // fallback
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
