import React, { useState } from 'react';
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
import type { RouteProp, NavigationProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../navigation/AppNavigator';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type NavProp = NavigationProp<AuthStackParamList, 'ResetPassword'>;

// Yup Validation Schema
const schema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required.')
    .length(6, 'OTP must be exactly 6 digits.')
    .matches(/^\d+$/, 'OTP must contain only numbers.'),
  newPassword: yup
    .string()
    .required('New password is required.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/\d/, 'Password must contain at least one number.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required.')
    .oneOf([yup.ref('newPassword')], 'Passwords must match.'),
});

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const { email } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await resetPassword(email, data.otp, data.newPassword, data.confirmPassword);
      Alert.alert(
        'Password Reset Successful',
        'Your password has been successfully updated. You can now sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      console.log('[ResetPasswordScreen] Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to reset password.';
      Alert.alert('Reset Failed', errorMessage);
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter reset OTP code and your new password for:</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>6-Digit OTP Code</Text>
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.otp && styles.inputError, styles.otpInput]}
                placeholder="000000"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                maxLength={6}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!loading}
              />
            )}
          />
          {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}

          <Text style={styles.label}>New Password</Text>
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.newPassword && styles.inputError]}
                placeholder="At least 6 chars, uppercase & number"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!loading}
              />
            )}
          />
          {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

          <Text style={styles.label}>Confirm New Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm new password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!loading}
              />
            )}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Cancel and Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

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
    marginBottom: 24,
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
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 4,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
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
  backButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
