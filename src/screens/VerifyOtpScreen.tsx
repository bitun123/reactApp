import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../navigation/AppNavigator';

type VerifyOtpRouteProp = RouteProp<AuthStackParamList, 'VerifyOtp'>;

const VerifyOtpScreen = () => {
  const route = useRoute<VerifyOtpRouteProp>();
  const navigation = useNavigation();
  const { verifyOTP, resendOTP } = useAuth();
  
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  // Timer cooldown logic
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6 || isNaN(Number(otp))) {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otp);
      Alert.alert('Verification Successful', 'Your account has been verified and activated.');
      // Authentication is handled automatically by context state
    } catch (error: any) {
      console.log('[VerifyOtpScreen] OTP Verification Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'OTP verification failed.';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setResendLoading(true);
    try {
      await resendOTP(email);
      setCooldown(60); // Reset timer
      Alert.alert('OTP Resent', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      console.log('[VerifyOtpScreen] OTP Resend Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to resend OTP.';
      Alert.alert('Error', errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>We sent a 6-digit verification code to:</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.formCard}>
          <TextInput
            style={styles.otpInput}
            placeholder="000000"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setOtp}
            value={otp}
            autoFocus
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify & Activate</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.resendContainer}>
          {resendLoading ? (
            <ActivityIndicator color="#6366f1" size="small" />
          ) : cooldown > 0 ? (
            <Text style={styles.cooldownText}>Resend code in {cooldown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend Verification Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  otpInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    width: '100%',
    textAlign: 'center',
    height: 60,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  cooldownText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  resendText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
