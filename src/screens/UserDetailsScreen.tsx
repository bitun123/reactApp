import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const UserDetailsScreen = ({ route }: any) => {
  const { user } = route.params;

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
});