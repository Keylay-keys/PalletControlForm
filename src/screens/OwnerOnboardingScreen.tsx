// src/screens/OwnerOnboardingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type OwnerOnboardingRouteProp = RouteProp<RootParamList, 'OwnerOnboarding'>;
type OwnerOnboardingNavigationProp = StackNavigationProp<RootParamList, 'OwnerOnboarding'>;

export default function OwnerOnboardingScreen() {
  const { colors } = useTheme();
  const route = useRoute<OwnerOnboardingRouteProp>();
  const navigation = useNavigation<OwnerOnboardingNavigationProp>();
  const hasTeamMembers = route.params?.hasTeamMembers || false;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [newRouteNumber, setNewRouteNumber] = useState('');
  const [routes, setRoutes] = useState<string[]>([]);
  const [teamEmails, setTeamEmails] = useState<string[]>([]);
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Error', 'No logged-in user found.');
          return;
        }

        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email || '');
          const initialRoute = userData.routeNumber || '';
          setRouteNumber(initialRoute);
          if (initialRoute) {
            setRoutes([initialRoute]);
          }
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, []);

  const addAdditionalRoute = () => {
    if (!newRouteNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid route number.');
      return;
    }

    if (routes.includes(newRouteNumber.trim())) {
      Alert.alert('Error', `Route ${newRouteNumber} is already added.`);
      return;
    }

    setRoutes([...routes, newRouteNumber.trim()]);
    setNewRouteNumber('');
    Alert.alert('Success', `Route ${newRouteNumber} has been added.`);
  };

  const addTeamEmail = () => {
    if (!newTeamEmail.trim() || teamEmails.includes(newTeamEmail.trim())) {
      Alert.alert('Error', 'Enter a valid, unique email address.');
      return;
    }
    setTeamEmails([...teamEmails, newTeamEmail.trim()]);
    setNewTeamEmail('');
    Alert.alert('Success', `${newTeamEmail.trim()} has been added.`);
  };

  const handleOnboardingComplete = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No logged-in user found.');
        return;
      }

      const firestore = getFirestore();
      const userDoc = doc(firestore, 'users', user.uid);

      await updateDoc(userDoc, {
        firstName,
        lastName,
        businessName,
        phone,
        routes,
        teamEmails,
        onboardingComplete: true,
        role: hasTeamMembers ? 'ownerWithTeam' : 'owner',
        hasTeam: hasTeamMembers,
      });

      navigation.navigate('Dashboard', { initialView: hasTeamMembers ? 'management' : 'operator' });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={colors.safeArea.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={routes.slice(1)}
        keyExtractor={(item, index) => `${item}-${index}`}
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Owner Setup</Text>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Please provide your personal details and route information.
            </Text>

            <View style={[styles.prePopulatedField, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.prePopulatedText, { color: colors.textMuted }]}>{email}</Text>
            </View>

            <View style={[styles.sectionContainer, { borderTopColor: colors.border }]}>
              <View style={[styles.prePopulatedField, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Primary Route Number</Text>
                <Text style={[styles.prePopulatedText, { color: colors.textMuted }]}>{routeNumber}</Text>
              </View>

              <TextInput
                style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Enter Additional Route Number"
                placeholderTextColor={colors.textSecondary}
                value={newRouteNumber}
                onChangeText={setNewRouteNumber}
                keyboardType="numeric"
              />

              <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addAdditionalRoute}>
                <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>Add Route</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="First Name"
              placeholderTextColor={colors.textSecondary}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Last Name"
              placeholderTextColor={colors.textSecondary}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Business Name"
              placeholderTextColor={colors.textSecondary}
              value={businessName}
              onChangeText={setBusinessName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Phone Number"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            {hasTeamMembers && (
              <>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Add Team Member Email"
                  placeholderTextColor={colors.textSecondary}
                  value={newTeamEmail}
                  onChangeText={setNewTeamEmail}
                />
                <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addTeamEmail}>
                  <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>Add Team Member</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={{ alignItems: 'center', marginTop: 16, paddingBottom: 20 }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
              onPress={handleOnboardingComplete}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                {loading ? 'Processing...' : 'Complete Setup'}
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.routeItem, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.routeText, { color: colors.textPrimary }]}>Route {item}</Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  title: { fontSize: 36, marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  sectionContainer: { marginTop: 16, borderTopWidth: 1, paddingTop: 16, marginBottom: 24 },
  prePopulatedField: { padding: 12, borderRadius: 8, marginBottom: 16 },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  prePopulatedText: { fontSize: 16 },
  input: { padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16, borderWidth: 1 },
  addButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  addButtonText: { fontSize: 18, textAlign: 'center', fontWeight: '500' },
  button: { paddingVertical: 18, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 28, fontWeight: 'bold' },
  routeItem: { padding: 12, borderRadius: 8, marginBottom: 8, marginHorizontal: 16 },
  routeText: { fontSize: 16 },
  teamItem: { padding: 12, borderRadius: 8, marginBottom: 8, width: '80%' },
  teamText: { fontSize: 16 },
});
