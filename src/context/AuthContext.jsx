import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // For demonstration purposes, we'll use mock login/signup
  const login = (email, password) => {
    // Simulating API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email === 'demo@example.com' && password === 'password') {
          const user = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            shopName: 'Demo Shop',
          };
          
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('Login successful!');
          resolve(user);
        } else {
          toast.error('Invalid credentials');
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const signup = (name, email, password, shopName) => {
    // Simulating API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // In a real app, you would make an API call to register the user
          const user = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            shopName,
          };
          
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('Account created successfully!');
          resolve(user);
        } catch (error) {
          toast.error('Failed to create account');
          reject(error);
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};