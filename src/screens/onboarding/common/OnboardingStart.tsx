// src/screens/onboarding/OnboardingStart.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { OnboardingStore } from '@/services/OnboardingStore';

type OnboardingStartNavigationProp = StackNavigationProp<RootParamList, 'OnboardingStart'>;

interface Props {
  navigation: OnboardingStartNavigationProp;
}

export default function OnboardingStart({ navigation }: Props) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [hasRoute, setHasRoute] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return false;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return false;
    }
    if (hasRoute && !routeNumber.trim()) {
      Alert.alert('Error', 'Please enter your primary route number.');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateInput()) return;

    setLoading(true);
    const auth = getAuth();

    try {
      await OnboardingStore.save({
        email: email.trim(),
        password,
        routeNumber: routeNumber.trim(),
        hasRoute,
      });

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      navigation.navigate('OnboardingVerification', {
        email: email.trim(),
        routeNumber: hasRoute ? routeNumber.trim() : '',
        userId: userCredential.user.uid,
      });
    } catch (error) {
      console.error('Signup error:', error);

      if (error instanceof Error && !auth.currentUser) {
        if (error.message.includes('too-many-requests')) {
          Alert.alert('Error', 'Please wait before trying again.');
        } else if (error.message.includes('email-already-in-use')) {
          Alert.alert('Error', 'This email is already registered.');
        } else {
          Alert.alert('Error', 'Failed to create account. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>

      <Text style={[styles.description, { color: colors.textMuted }]}>
        {hasRoute
          ? 'Please enter your primary route number.'
          : 'Please enter your details to create an owner account.'}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Email Address"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.routeToggleContainer}>
        <TouchableOpacity style={styles.routeToggle} onPress={() => setHasRoute(!hasRoute)}>
          <Text style={[styles.routeToggleText, { color: colors.textSecondary }]}>
            {hasRoute ? "I don't have a route number" : 'I have a route number'}
          </Text>
        </TouchableOpacity>
      </View>

      {hasRoute && (
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
          ]}
          placeholder="Route Number"
          placeholderTextColor={colors.textSecondary}
          value={routeNumber}
          onChangeText={setRouteNumber}
          keyboardType="numeric"
        />
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          loading && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.textPrimary} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  routeToggleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  routeToggle: {
    padding: 8,
  },
  routeToggleText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
