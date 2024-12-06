// src/components/auth/SignupForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { OnboardingStore } from '@/services/OnboardingStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { UserData } from '../../interfaces/auth';

interface SignupFormProps {
  onSignupSuccess?: (userData: UserData) => void; // Optional in case it's not always needed
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const navigation = useNavigation<StackNavigationProp<RootParamList, 'OnboardingStart'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !routeNumber.trim()) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    setLoading(true);

    try {
      const firestore = getFirestore();

      // Check if the route number already exists in Firestore
      const routeDoc = await getDoc(doc(firestore, 'routeNumbers', routeNumber));
      if (routeDoc.exists()) {
        Alert.alert('Error', 'This route number is already registered.');
        setLoading(false);
        return;
      }

      // Save user information temporarily using OnboardingStore
      await OnboardingStore.save({
        email,
        password,
        routeNumber,
        hasRoute: true, // This indicates the user has a route
      });

      Alert.alert(
        'Account Saved',
        'Your account details are saved locally. You will verify your route in the next step.'
      );

      // Notify the parent component (if required)
      if (onSignupSuccess) {
        onSignupSuccess({
          email,
          routeNumber,
          adminReviewStatus: 'pending',
          hasRoleSelected: false,
          uid: '', // UID isn't available yet, but you can add logic to generate one if needed
        });
      }

      // Navigate to OnboardingPCF for route verification
      navigation.navigate('OnboardingPCF', {
        email,
        routeNumber,
        password,
        isTeamMember: false, // Set this to false as it's for the owner
      });
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred.';
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Please use the email address associated with your route. If you own more than one route,
        you will be able to add more in the next step. Your email and route number(s) will be
        permanently linked.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Work Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Route Number"
        placeholderTextColor="#94a3b8"
        value={routeNumber}
        onChangeText={setRouteNumber}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.signupButton, loading && styles.signupButtonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>
          {loading ? 'Saving Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#0f172a',
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#e2e8f0',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#064e3b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  infoText: {
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 20,
    lineHeight: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
