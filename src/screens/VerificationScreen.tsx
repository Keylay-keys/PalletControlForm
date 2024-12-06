// VerificationScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type VerificationScreenNavigationProp = StackNavigationProp<RootParamList, 'Verification'>;

export default function VerificationScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not logged in.');
      }

      await sendEmailVerification(user);
      Alert.alert(
        'Verification Sent',
        'A new verification link has been sent to your email.'
      );
    } catch (error) {
      console.error('Error sending verification email:', error);
      Alert.alert('Error', 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    try {
      const auth = getAuth();
      const db = getFirestore();

      // Ensure user is logged in and reload to get latest email verification status
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No logged-in user found.');
      }
      await user.reload();

      if (user.emailVerified) {
        console.log('Email verified! Checking Firestore...');
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          Alert.alert('Error', 'User data not found. Please contact support.');
          return;
        }

        const userData = userDocSnap.data();
        const adminReviewStatus = userData?.adminReviewStatus ?? 'pending';
        const hasRoleSelected = userData?.hasRoleSelected ?? false;
        const hasTeam = userData?.hasTeam ?? false;

        console.log('Firestore Data:', { adminReviewStatus, hasRoleSelected, hasTeam });

        // Navigate based on admin review and role selection status
        if (adminReviewStatus === 'pending') {
          console.log('Navigating to PendingReview');
          navigation.navigate('PendingReview');
        } else if (!hasRoleSelected) {
          console.log('Navigating to RoleSelection');
          navigation.navigate('RoleSelection');
        } else {
          console.log('Navigating to Dashboard');
          navigation.navigate('Dashboard', { initialView: hasTeam ? 'management' : 'operator' });
        }
      } else {
        Alert.alert('Error', 'Your email is not verified yet.');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      Alert.alert('Error', 'Failed to check verification status.');
    } finally {
      setCheckingVerification(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Verify Your Email
      </Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        A verification link has been sent to your email address. Please verify your email before continuing.
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          loading && styles.buttonDisabled,
        ]}
        onPress={handleResendVerification}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          {loading ? 'Resending...' : 'Resend Verification Email'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          checkingVerification && styles.buttonDisabled,
        ]}
        onPress={handleCheckVerification}
        disabled={checkingVerification}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          {checkingVerification ? 'Checking...' : 'Check Verification'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Auth')}>
        <Text style={[styles.backButtonText, { color: colors.textMuted }]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
  },
});
