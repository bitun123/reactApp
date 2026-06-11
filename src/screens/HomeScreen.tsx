
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

import ThunderforestMap from '../components/ThunderforestMap';

const HomeScreen = ({ navigation }: any) => {
  const [latitude, setLatitude] = useState('22.5726');
  const [longitude, setLongitude] = useState('88.3639');

  const [location, setLocation] = useState({
    lat: 22.5726,
    lng: 88.3639,
  });

  const handleShowLocation = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    setLocation({
      lat,
      lng,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Directory App</Text>

      <Text style={styles.subtitle}>
        Browse users, view profile details, company information,
        contact details, and more.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 User Management</Text>
        <Text style={styles.cardText}>
          View a list of users fetched from a remote API.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 User Profiles</Text>
        <Text style={styles.cardText}>
          View user profile and location information.
        </Text>
      </View>

      <Text style={styles.mapTitle}>Enter Location </Text>

      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleShowLocation}
      >
        <Text style={styles.buttonText}>
          Show Location
        </Text>
      </TouchableOpacity>

      <View style={{ height: 400 }}>
        <ThunderforestMap
          key={`${location.lat}-${location.lng}`}
          latitude={location.lat}
          longitude={location.lng}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>
          View Users
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  cardText: {
    fontSize: 14,
  },

  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

