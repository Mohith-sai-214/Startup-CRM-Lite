import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext();

/**
 * Authentication context provider.
 * Manages active user states, session retrieval, and auth operations (login, register, logout).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Restore session on initial mount if token is stored in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const profileRes = await authService.getProfile();
          // Profile response is { success: true, message: ..., data: userObject }
          if (profileRes && profileRes.data) {
            setUser(profileRes.data);
          } else {
            // Clear credentials if profile fetch returns invalid shape
            handleLogoutClean();
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          handleLogoutClean();
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const handleLogoutClean = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  /**
   * Logins a user using email and password.
   * @param {string} email - Email input.
   * @param {string} password - Password input.
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      // login response structure: { success: true, message: ..., data: { token, user } }
      if (res && res.data && res.data.token) {
        const { token: userToken, user: userProfile } = res.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userProfile);
        return res;
      } else {
        throw new Error('Invalid login response from server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registers a new user.
   * @param {string} name - Name input.
   * @param {string} email - Email input.
   * @param {string} password - Password input.
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, password);
      // register response structure: { success: true, message: ..., data: { token, user } }
      if (res && res.data && res.data.token) {
        const { token: userToken, user: userProfile } = res.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userProfile);
        return res;
      } else {
        throw new Error('Invalid registration response from server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user and clears authentication state.
   */
  const logout = () => {
    handleLogoutClean();
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook to consume AuthContext.
 * @returns {Object} Authentication states and methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider wrapper');
  }
  return context;
};
