
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';


import ThunderforestMap from '../components/ThunderforestMap';

const HomeScreen = ({ navigation }: any) => {

  const [points, setPoints] = useState([
  {
    lat: '',
    lng: '',
  },
]);

// For demonstration, this function adds a new point to the list of points.
  const addPoint = () => {
  setPoints(prev => [
    ...prev,
    {
      lat: '',
      lng: '',
    },
  ]);
};

// This function converts the list of points into a format suitable for rendering a polygon on the map.
const polygonPoints = points
  .filter(
    p =>
      p.lat.trim() !== '' &&
      p.lng.trim() !== '' &&
      !isNaN(Number(p.lat)) &&
      !isNaN(Number(p.lng)),
  )
  .map(p => [
    Number(p.lat),
    Number(p.lng),
  ]) as number[][];

  const removePoint = (index: number) => {
  if (points.length === 1) {
    return;
  }

  setPoints(prev =>
    prev.filter((_, i) => i !== index),
  );
};


const requestLocationPermission = async () => {
  const granted =
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

  return (
    granted ===
    PermissionsAndroid.RESULTS.GRANTED
  );
};


const getCurrentLocation = async () => {
  const hasPermission =
    await requestLocationPermission();

  if (!hasPermission) {
    return;
  }

  Geolocation.getCurrentPosition(
    position => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      setPoints(prev => [
        ...prev,
        {
          lat: latitude.toString(),
          lng: longitude.toString(),
        },
      ]);
    },

    error => {
      console.log(error);
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  );
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

{points.map((point, index) => (
  <View key={index}>

    <Text>Location {index + 1}</Text>

    <TextInput
      style={styles.input}
      placeholder="Latitude"
      value={point.lat}
      onChangeText={text => {
        const copy = [...points];
        copy[index].lat = text;
        setPoints(copy);
      }}
    />

    <TextInput
      style={styles.input}
      placeholder="Longitude"
      value={point.lng}
      onChangeText={text => {
        const copy = [...points];
        copy[index].lng = text;
        setPoints(copy);
      }}
    />

    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => removePoint(index)}
    >
      <Text style={styles.removeButtonText}>
        Remove Location
      </Text>
    </TouchableOpacity>

  </View>
))} 

<TouchableOpacity
  style={styles.button}
  onPress={addPoint}
>
  <Text style={styles.buttonText}>
    Add Point
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={getCurrentLocation}
>
  <Text style={styles.buttonText}>
    Use My Current Location
  </Text>
</TouchableOpacity>

      <View style={{ height: 400 }}>
     <ThunderforestMap
  polygonPoints={polygonPoints}
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
  removeButton: {
  backgroundColor: '#EF4444',
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 15,
},

removeButtonText: {
  color: '#FFFFFF',
  fontWeight: '700',
},
});

