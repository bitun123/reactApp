import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import type { User } from '../screens/ProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  UserDetails: { user: User };
};

export type MainTabsParamList = {
  Home: undefined;
  Users?: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Users',
        }}
      />

      <ProfileStack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          title: 'User Details',
        }}
      />
    </ProfileStack.Navigator>
  );
}

function MainTabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Users"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name="MainTabs"
          component={MainTabsNavigator}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
