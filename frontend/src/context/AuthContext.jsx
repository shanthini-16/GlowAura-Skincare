import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('glowaura_token'));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login', 'register', 'otp'

  useEffect(() => {
    if (token) {
      authAPI.getProfile()
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginUser = (tokenStr, userData) => {
    localStorage.setItem('glowaura_token', tokenStr);
    setToken(tokenStr);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('glowaura_token');
    localStorage.removeItem('glowaura_last_scan');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      loginUser,
      logout,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
