import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>RA</Text>
        </View>
        <Text style={styles.title}>ReactApp</Text>
        <Text style={styles.subtitle}>Production Authentication</Text>
      </View>
      <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Sleek Slate 900
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#6366f1', // Indigo 500
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8', // Slate 400
    marginTop: 4,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
});
