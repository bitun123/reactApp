import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  resendOTP: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, otp: string, newPassword: string, confirmPassword: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check storage on app launch
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        // Validate token by fetching current profile
        const profile = await authService.getProfile();
        setUser(profile.data.user);
      }
    } catch (error) {
      console.log('[AuthContext] Session verification failed. Token cleared.', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { token: userToken, data: { user: userData } } = response;
      
      await AsyncStorage.setItem('auth_token', userToken);
      setToken(userToken);
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      return await authService.register(name, email, password, confirmPassword);
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      const { token: userToken, data: { user: userData } } = response;

      await AsyncStorage.setItem('auth_token', userToken);
      setToken(userToken);
      setUser(userData);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    return await authService.resendOTP(email);
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (email: string, otp: string, newPassword: string, confirmPassword: string) => {
    return await authService.resetPassword(email, otp, newPassword, confirmPassword);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('[AuthContext] Logout storage clearing failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        logout,
        checkAuthStatus,
      }}
    >
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
