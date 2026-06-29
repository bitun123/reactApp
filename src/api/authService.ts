import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getApiUrl } from '../config/env';

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to log requests and attach JWT token to requests if it exists
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`[API REQUEST STARTED] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    } catch (error) {
      console.error('[AuthService API] Request interceptor error:', error);
    }
    return config;
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Interceptor to log responses and format generic network errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE SUCCESS] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (!error.response) {
      // No response was received (Network Error)
      console.error(`[API RESPONSE ERROR - NETWORK FAIL] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.message);
      
      const detailedError = new Error(
        'Cannot connect to backend server. Please verify the backend is running and that port 5000 is forwarded (run: adb reverse tcp:5000 tcp:5000).'
      );
      // Retain original configuration reference
      Object.assign(detailedError, { response: error.response, config: error.config, isNetworkError: true });
      return Promise.reject(detailedError);
    }

    console.error(`[API RESPONSE ERROR - ${error.response.status}] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response.data);
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Register a new user.
   */
  async register(name: string, email: string, password: string, confirmPassword: string) {
    const response = await api.post('/auth/register', { name, email, password, confirmPassword });
    return response.data;
  },

  /**
   * Login user.
   */
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Verify OTP to activate account.
   */
  async verifyOTP(email: string, otp: string) {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Resend OTP.
   */
  async resendOTP(email: string) {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  /**
   * Forgot password OTP request.
   */
  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password using OTP.
   */
  async resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string) {
    const response = await api.post('/auth/reset-password', { 
      email, 
      otp, 
      newPassword, 
      confirmPassword 
    });
    return response.data;
  },

  /**
   * Fetch logged-in user profile.
   */
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default api;
