// src/screens/onboarding/AdditionalRoutes.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootParamList } from '@/types';
import { Ionicons } from '@expo/vector-icons';

type AdditionalRoutesProps = {
  navigation: StackNavigationProp<RootParamList, 'AdditionalRoutes'>;
  route: RouteProp<RootParamList, 'AdditionalRoutes'>;
};

export default function AdditionalRoutes({ navigation, route }: AdditionalRoutesProps) {
  const { colors } = useTheme();
  const { email, password, role } = route.params;

  const [newRouteNumber, setNewRouteNumber] = useState('');
  const [routes, setRoutes] = useState<string[]>([]);

  const addRoute = () => {
    if (!newRouteNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid route number.');
      return;
    }

    if (routes.includes(newRouteNumber.trim())) {
      Alert.alert('Error', 'This route number is already added.');
      return;
    }

    setRoutes([...routes, newRouteNumber.trim()]);
    setNewRouteNumber('');
  };

  const handleVerifyRoute = (routeNumber: string) => {
    if (!routeNumber.trim()) {
      Alert.alert('Error', 'Please select a valid route to verify.');
      return;
    }

    navigation.navigate('OnboardingPCF', {
      email,
      routeNumber,
      password,
      isTeamMember: false,
    });
  };

  const handleContinue = () => {
    if (routes.length === 0) {
      Alert.alert('Error', 'Please add at least one route.');
      return;
    }
  
    // Navigate based on role and setup
    if (role === 'ownerWithTeam' || role === 'ownerOnly') {
      navigation.navigate('TeamSetup', { 
        routes, 
        ownerType: role === 'ownerWithTeam' ? 'owner' : 'ownerOnly' 
      });
    } else if (role === 'owner') {
      navigation.navigate('Dashboard', { 
        initialView: 'operator' 
      });
    } else {
      Alert.alert('Error', 'Unknown role. Cannot continue.');
    }
  };
  
  
  
  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Add Routes</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Enter Route Number"
        placeholderTextColor={colors.textSecondary}
        value={newRouteNumber}
        onChangeText={setNewRouteNumber}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={addRoute}
      >
        <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>Add Route</Text>
      </TouchableOpacity>

      <FlatList
        data={routes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[styles.routeItem, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.routeText, { color: colors.textPrimary }]}>Route {item}</Text>
            <TouchableOpacity
              style={[styles.verifyButton, { backgroundColor: colors.primary }]}
              onPress={() => handleVerifyRoute(item)}
            >
              <Text style={[styles.verifyButtonText, { color: colors.textPrimary }]}>Verify</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
        onPress={handleContinue}
      >
        <Text style={[styles.continueButtonText, { color: colors.textPrimary }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16, borderWidth: 1 },
  addButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  routeText: { fontSize: 16 },
  verifyButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  verifyButtonText: { fontSize: 14, fontWeight: 'bold' },
  continueButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  continueButtonText: { fontSize: 16, fontWeight: 'bold' },
});
