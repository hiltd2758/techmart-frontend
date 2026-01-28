import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Verify token expiry (basic check)
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired
          logout();
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token, refreshToken, userData) => {
    // Decode token to get extra info if needed, or use userData passed from Login
    // For now, we assume user data is fully provided or we can extract roles from token

    let userToSave = userData;

    if (!userToSave) {
      // Fallback: decode basic info from token if not provided
      try {
        const decoded = jwtDecode(token);
        userToSave = {
          username: decoded.sub || decoded.username,
          roles: decoded.roles || [],
          email: decoded.email,
          // Map other claims if present
        };
      } catch (e) {
        console.error("Login decode error", e);
      }
    }

    // Save to LocalStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userToSave));

    // Update State
    setUser(userToSave);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    // Note: You might want to reload or redirect here, but usually the UI reacts to state change
    // window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);