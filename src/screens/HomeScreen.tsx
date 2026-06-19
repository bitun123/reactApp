import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';

import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabsParamList } from '../navigation/AppNavigator';

import ThunderforestMap from '../components/ThunderforestMap';

type Props = BottomTabScreenProps<MainTabsParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();

  const [points, setPoints] = useState([
    {
      lat: '',
      lng: '',
    },
  ]);

  const addPoint = () => {
    setPoints(prev => [
      ...prev,
      {
        lat: '',
        lng: '',
      },
    ]);
  };

  const removePoint = (index: number) => {
    if (points.length === 1) {
      return;
    }

    setPoints(prev => prev.filter((_, i) => i !== index));
  };

  const polygonPoints = points
    .filter(
      p =>
        p.lat.trim() !== '' &&
        p.lng.trim() !== '' &&
        !isNaN(Number(p.lat)) &&
        !isNaN(Number(p.lng)),
    )
    .map(p => [Number(p.lat), Number(p.lng)]) as number[][];

  const requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setPoints(prev => [
          ...prev,
          {
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
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

  const checkForUpdate = () => {
    const currentVersion = DeviceInfo.getVersion();
    const latestVersion = '1.1.0';

    if (currentVersion !== latestVersion) {
      Alert.alert(
        t('updateAvailable'),
        t('newVersionAvailable'),
        [
          {
            text: t('later'),
            style: 'cancel',
          },
          {
            text: t('update'),
            onPress: () => {
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.reactapp',
              );
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {t('userDirectoryApp')}
      </Text>

      {/* Language Switcher */}
      <View style={styles.languageContainer}>
  <TouchableOpacity
    style={[
      styles.languageButton,
      i18n.language === 'en' && styles.activeLanguageButton,
    ]}
    onPress={() => i18n.changeLanguage('en')}>
    <Text
      style={[
        styles.languageButtonText,
        i18n.language === 'en' && styles.activeLanguageButtonText,
      ]}>
      EN
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.languageButton,
      i18n.language === 'hi' && styles.activeLanguageButton,
    ]}
    onPress={() => i18n.changeLanguage('hi')}>
    <Text
      style={[
        styles.languageButtonText,
        i18n.language === 'hi' && styles.activeLanguageButtonText,
      ]}>
      HI
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.languageButton,
      i18n.language === 'bn' && styles.activeLanguageButton,
    ]}
    onPress={() => i18n.changeLanguage('bn')}>
    <Text
      style={[
        styles.languageButtonText,
        i18n.language === 'bn' && styles.activeLanguageButtonText,
      ]}>
      BN
    </Text>
  </TouchableOpacity>
</View>
      <Text style={styles.subtitle}>
        {t('browseUsersDescription')}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📋 {t('userManagement')}
        </Text>

        <Text style={styles.cardText}>
          {t('userManagementDescription')}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          👤 {t('userProfiles')}
        </Text>

        <Text style={styles.cardText}>
          {t('userProfilesDescription')}
        </Text>
      </View>

      <Text style={styles.mapTitle}>
        {t('enterLocation')}
      </Text>

      {points.map((point, index) => (
        <View key={index}>
          <Text>
            {t('location')} {index + 1}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('latitude')}
            value={point.lat}
            onChangeText={text => {
              const copy = [...points];
              copy[index].lat = text;
              setPoints(copy);
            }}
          />

          <TextInput
            style={styles.input}
            placeholder={t('longitude')}
            value={point.lng}
            onChangeText={text => {
              const copy = [...points];
              copy[index].lng = text;
              setPoints(copy);
            }}
          />

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removePoint(index)}>
            <Text style={styles.removeButtonText}>
              {t('removeLocation')}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={addPoint}>
        <Text style={styles.buttonText}>
          {t('addPoint')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>
          {t('useCurrentLocation')}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 400 }}>
        <ThunderforestMap polygonPoints={polygonPoints} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Users', {
            screen: 'Profile',
          })
        }>
        <Text style={styles.buttonText}>
          {t('viewUsers')}
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

  languageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },

  languageButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
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
    marginTop: 10,
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
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


activeLanguageButton: {
  backgroundColor: '#1D4ED8',
  borderWidth: 2,
  borderColor: '#0F172A',
},

languageButtonText: {
  color: '#FFFFFF',
  fontWeight: '600',
},

activeLanguageButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},
});