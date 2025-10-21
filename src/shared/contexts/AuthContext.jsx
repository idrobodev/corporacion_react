import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../services/api";

// Single context for simplicity and reliability
const AuthContext = createContext(undefined);

// Main hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('authToken');
        
        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser);
            
            if (user && user.email && (user.id || user.userId)) {
              setCurrentUser(user);
            } else {
              setCurrentUser(null);
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
            }
          } catch (parseError) {
            console.error('Error parseando usuario:', parseError);
            setCurrentUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error inicializando auth:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  const login = useCallback(async (email, password) => {
    console.log('🚀 AuthContext: Starting login process...');
    console.log('👤 Attempting login for email:', email);

    try {
      console.log('🔗 Calling api.login...');
      const { data, error } = await api.login(email, password);

      if (error) {
        console.error('❌ API login returned error:', error);
        throw error;
      }

      console.log('✅ API login successful, user:', data.user.email);
      console.log('🔄 Setting current user in context...');
      setCurrentUser(data.user);
      console.log('🎯 AuthContext login completed successfully');
      return { user: data.user };
    } catch (error) {
      console.error('💥 AuthContext login failed:', error);
      console.error('📋 Error type:', error.type || 'unknown');
      console.error('🌐 Is network error:', error.isNetworkError);
      console.error('🔒 Is CORS error:', error.isCorsError);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      try {
        await api.logout();
      } catch (logoutError) {
        console.warn('Error notificando logout al servidor:', logoutError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error durante logout:', error);
      setCurrentUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw error;
    }
  }, []);

  const forgetPassword = useCallback(async (email) => {
    const { error } = await api.resetPassword(email);
    if (error) throw error;
    return { success: true };
  }, []);
  const value = useMemo(() => ({
    currentUser,
    loading,
    login,
    logout,
    forgetPassword,
  }), [currentUser, loading, login, logout, forgetPassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
