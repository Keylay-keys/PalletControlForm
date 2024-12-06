// components/auth/CustomAuthUI.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AuthUIProps {
  onEmailAuth: () => void;
  onGoogleAuth: () => void;
  onCreateAccount: () => void;
}

export default function CustomAuthUI({ onEmailAuth, onGoogleAuth, onCreateAccount }: AuthUIProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.mainButtons}>
        <TouchableOpacity 
          style={[styles.emailButton, { backgroundColor: colors.primary }]} 
          onPress={onEmailAuth}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Sign In with Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.googleButton]} 
          onPress={onGoogleAuth}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Sign In with Google
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.createAccountButton} 
        onPress={onCreateAccount}
      >
        <Text style={[styles.createAccountText, { color: colors.textSecondary }]}>
          Create New Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  mainButtons: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  emailButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    padding: 16,
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: '500',
  },
});