// components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserData } from '../../interfaces/auth';

interface LoginFormProps {
  onLoginSuccess: (userData: UserData) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !routeNumber.trim()) {
      Alert.alert('Error', 'Please enter both email and route number');
      return;
    }

    setLoading(true);

    try {
      const password = `route${routeNumber}`; // Ensure this matches the signup logic
      const result = await auth().signInWithEmailAndPassword(email, password);

      const userDoc = await firestore()
        .collection('users')
        .doc(result.user.uid)
        .get();

      if (userDoc.exists && userDoc.data()?.routeNumber === routeNumber) {
        onLoginSuccess({
          uid: result.user.uid,
          email: result.user.email!,
          routeNumber,
        });
      } else {
        Alert.alert('Error', 'Invalid route number for this account');
        await auth().signOut();
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'Unable to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Work Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading} // Disable input during loading
      />
      <TextInput
        style={styles.input}
        placeholder="Route Number"
        placeholderTextColor="#94a3b8"
        value={routeNumber}
        onChangeText={setRouteNumber}
        keyboardType="numeric"
        editable={!loading} // Disable input during loading
      />
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Logging in...' : 'Login'}
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
  loginButton: {
    backgroundColor: '#660000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
