// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserData } from '../../interfaces/auth';
import { useTheme } from '../../hooks/useTheme';

interface LoginFormProps {
  onLoginSuccess: (userData: UserData) => void;  // Updated to match interface
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const firestore = getFirestore();

      // Authenticate user
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();

      if (!userDoc.exists() || !userData) {
        throw new Error('User data not found');
      }

      // Call onLoginSuccess with combined user data
      onLoginSuccess({
        uid: user.uid,
        email: user.email!,
        routeNumber: userData.routeNumber || '',
        emailVerified: user.emailVerified,
        adminReviewStatus: userData.adminReviewStatus || 'pending',
        hasRoleSelected: userData.hasRoleSelected || false,
        hasTeam: userData.hasTeam || false
      });

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity
        style={[
          styles.loginButton,
          { backgroundColor: colors.primary },
          loading && styles.loginButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={[styles.loginButtonText, { color: colors.textPrimary }]}>
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
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
