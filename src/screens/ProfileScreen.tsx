import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    city: string;
  };
}

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'Profile'>>();
  const { logout } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] ProfileScreen mounted.');
    console.log('[DEBUG] ProfileScreen navigation state:', navigation.getState ? JSON.stringify(navigation.getState(), null, 2) : 'No getState');
    fetchUsers();
  }, [navigation]);

  useEffect(() => {
    console.log('PROFILE SCREEN MOUNTED');
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
      );

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (user: User) => {
    console.log('[DEBUG] User card clicked in ProfileScreen. Navigating to UserDetails with user:', JSON.stringify(user));
    console.log('[DEBUG] ProfileScreen navigation state before navigate:', navigation.getState ? JSON.stringify(navigation.getState(), null, 2) : 'No getState');
    navigation.navigate('UserDetails', {
      user,
    });
  };

  const renderUser = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleUserPress(item)}
    >
      <Text style={styles.name}>
        {item.name}
      </Text>

      <Text>{item.email}</Text>

      <Text>{item.company.name}</Text>

      <Text>{item.address.city}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Active Directory</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id.toString()}
      renderItem={renderUser}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{
        padding: 12,
      }}
    />
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});