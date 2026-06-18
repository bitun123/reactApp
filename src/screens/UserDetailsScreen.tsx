import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../navigation/AppNavigator';

const UserDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'UserDetails'>>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'UserDetails'>>();
  
  React.useEffect(() => {
    console.log('[DEBUG] UserDetailsScreen mounted.');
    console.log('[DEBUG] UserDetailsScreen route.params:', JSON.stringify(route.params || {}));
    console.log('[DEBUG] UserDetailsScreen navigation state:', navigation.getState ? JSON.stringify(navigation.getState(), null, 2) : 'No getState');
  }, [route.params, navigation]);

  const user = route.params?.user;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No user details available.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('[DEBUG] Fallback Go Back button clicked on UserDetailsScreen.');
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.username}>@{user.username}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user.phone}</Text>

        <Text style={styles.label}>Website</Text>
        <Text style={styles.value}>{user.website}</Text>

        <Text style={styles.label}>Company</Text>
        <Text style={styles.value}>{user.company.name}</Text>

        <Text style={styles.label}>City</Text>
        <Text style={styles.value}>{user.address.city}</Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          console.log('[DEBUG] Back to Users button clicked on UserDetailsScreen.');
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>← Back to Users</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  username: {
    color: '#666',
    marginBottom: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },

  label: {
    fontWeight: 'bold',
    marginTop: 12,
    color: '#555',
  },

  value: {
    fontSize: 16,
    marginTop: 4,
  },

  backButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },

  backButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
});