// OwnerOnlyOnbaordingScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';

export default function OwnerOnlyOnboardingScreen() {
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
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
          setRouteNumber(userData.routeNumber || '');
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
    if (!routeNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid route number.');
      return;
    }

    if (routes.includes(routeNumber.trim())) {
      Alert.alert('Error', `Route ${routeNumber} is already added.`);
      return;
    }

    setRoutes([...routes, routeNumber.trim()]);
    setRouteNumber('');
    Alert.alert('Route Added', `Route ${routeNumber} has been added.`);
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

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !businessName || !phone || teamEmails.length === 0) {
      Alert.alert('Error', 'Please fill out all fields and add at least one team member.');
      return;
    }

    setLoading(true);

    try {
      const firestore = getFirestore();

      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', email), {
        firstName,
        lastName,
        email,
        businessName,
        phone,
        routes,
        teamEmails,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Your information has been successfully saved.');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Owner Setup</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Please provide your details to complete your profile setup.
        </Text>

        {/* First Name */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="First Name"
          placeholderTextColor={colors.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Last Name"
          placeholderTextColor={colors.textSecondary}
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Email */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false} // Email is non-editable
        />

        {/* Business Name */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Business Name"
          placeholderTextColor={colors.textSecondary}
          value={businessName}
          onChangeText={setBusinessName}
        />

        {/* Phone Number */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Phone Number"
          placeholderTextColor={colors.textSecondary}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Routes */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Route Number"
          placeholderTextColor={colors.textSecondary}
          value={routeNumber}
          onChangeText={setRouteNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addAdditionalRoute}>
          <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>Add Additional Route</Text>
        </TouchableOpacity>

        {/* List of Routes */}
        {routes.length > 0 && (
          <FlatList
            data={routes}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={{ backgroundColor: colors.background }}
            renderItem={({ item }) => <Text style={[styles.listItem, { color: colors.textPrimary }]}>Route: {item}</Text>}
          />
        )}

        {/* Add Team Members */}
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

        {/* List of Team Members */}
        {teamEmails.length > 0 && (
          <FlatList
            data={teamEmails}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={{ backgroundColor: colors.background }}
            renderItem={({ item }) => <Text style={[styles.listItem, { color: colors.textPrimary }]}>Email: {item}</Text>}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            {loading ? 'Setting up...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16, flexGrow: 1 },
  title: { fontSize: 36, marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  input: { padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16, borderWidth: 1 },
  addButton: { padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  addButtonText: { fontSize: 16, fontWeight: '500' },
  listItem: { marginBottom: 8 },
  button: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
