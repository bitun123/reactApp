import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

import type { User } from '../screens/ProfileScreen';

// Stack Param Lists
export type ProfileStackParamList = {
  Profile: undefined;
  UserDetails: { user: User };
};

export type MainTabsParamList = {
  Home: undefined;
  Users: NavigatorScreenParams<ProfileStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyOtp: { email: string };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackNavigator() {
  const { t } = useTranslation();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('users'),
        }}
      />
      <ProfileStack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          title: t('userDetails'),
        }}
      />
    </ProfileStack.Navigator>
  );
}

function MainTabsNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('home'),
        }}
      />
      <Tab.Screen
        name="Users"
        component={ProfileStackNavigator}
        options={{
          title: t('users'),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <RootStack.Screen name="Splash" component={SplashScreen} />
        ) : user === null ? (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        ) : (
          <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
