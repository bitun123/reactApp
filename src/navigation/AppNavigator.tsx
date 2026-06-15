import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import UserDetailsScreen from '../screens/UserDetailsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  UserDetails: { user: any };
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="UserDetails"
          component={UserDetailsScreen}
          options={{
            title: 'User Details',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;