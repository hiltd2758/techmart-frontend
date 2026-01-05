import React, { createContext, useContext, useState, useEffect } from 'react';  
  
const AuthContext = createContext();  
  
export const useAuth = () => {  
  const context = useContext(AuthContext);  
  if (!context) {  
    throw new Error('useAuth must be used within an AuthProvider');  
  }  
  return context;  
};  
  
export const AuthProvider = ({ children }) => {  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [user, setUser] = useState(null);  
  
  useEffect(() => {  
    const token = localStorage.getItem('token');  
    const userData = localStorage.getItem('user');  
      
    if (token && userData) {  
      setIsAuthenticated(true);  
      setUser(JSON.parse(userData));  
    }  
  }, []);  
  
  const login = (token, userData) => {  
    localStorage.setItem('token', token);  
    localStorage.setItem('user', JSON.stringify(userData));  
    setIsAuthenticated(true);  
    setUser(userData);  
  };  
  
  const logout = () => {  
    localStorage.removeItem('token');  
    localStorage.removeItem('user');  
    setIsAuthenticated(false);  
    setUser(null);  
  };  
  
  return (  
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};