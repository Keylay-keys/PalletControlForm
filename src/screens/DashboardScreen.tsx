import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import OperatorDashboard from './OperatorDashboard';
import ManagementDashboardScreen from './ManagementDashboardScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types'; // Adjust the path to your RootParamList

const Tab = createMaterialTopTabNavigator();

export default function Dashboard() {
  const { colors } = useTheme();
  const [userType, setUserType] = useState<'management' | 'operator' | 'both' | null>(null);
  const [primaryRoute, setPrimaryRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Correctly type the navigation object
  const navigation = useNavigation<StackNavigationProp<RootParamList, 'Dashboard'>>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error('No authenticated user');

        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (!userData) throw new Error('User data not found in Firestore');

        if (userData.role === 'owner') {
          setUserType('operator');
        } else if (userData.role === 'ownerWithTeam') {
          setUserType('both');
        } else if (userData.role === 'ownerOnly' || userData.isOwnerOnly) {
          setUserType('management');
        }

        setPrimaryRoute(userData.routeNumber || null);
      } catch (error) {
        console.error('[Dashboard] Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleScan = () => {
    navigation.navigate('Scan'); // This will now work correctly
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (userType === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary, textAlign: 'center', padding: 20 }}>
          Unable to determine your dashboard type. Please contact support.
          {'\n\n'}
          Error Code: NO_VALID_ROLE
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          margin: 16,
        }}
        onPress={handleScan}
      >
        <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>New Scan</Text>
      </TouchableOpacity>
      {userType === 'both' ? (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: colors.background },
            tabBarIndicatorStyle: { backgroundColor: colors.primary },
            tabBarActiveTintColor: colors.textPrimary,
            tabBarInactiveTintColor: colors.textSecondary,
          }}
        >
          <Tab.Screen
            name="MyRoute"
            options={{ title: 'My Route' }}
          >
            {() => <OperatorDashboard primaryRoute={primaryRoute} />}
          </Tab.Screen>
          <Tab.Screen
            name="Management"
            component={ManagementDashboardScreen}
            options={{ title: 'Team & Routes' }}
          />
        </Tab.Navigator>
      ) : userType === 'management' ? (
        <ManagementDashboardScreen />
      ) : (
        <OperatorDashboard primaryRoute={primaryRoute} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
