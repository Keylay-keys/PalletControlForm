// CreateAccountScreen.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SignupForm from '../components/auth/SignupForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';
import { UserData } from '../interfaces/auth';

type CreateAccountNavigationProp = StackNavigationProp<RootParamList, 'CreateAccountScreen'>;

export default function CreateAccountScreen() {
  const navigation = useNavigation<CreateAccountNavigationProp>();

  const handleSignupSuccess = (userData: UserData) => {
    // Check email verification
    if (!userData.emailVerified) {
      navigation.navigate('Verification', {
        email: userData.email,
        message: 'Please verify your email before continuing.',
      });
      return;
    }

    // Check admin review status
    if (userData.adminReviewStatus === 'pending') {
      navigation.navigate('PendingReview');
      return;
    }

    // Check if the role has been selected
    if (!userData.hasRoleSelected) {
      navigation.navigate('RoleSelection');
    } else {
      navigation.navigate('Dashboard', { initialView: 'operator' }); // Pass the default view
    }
  };

  return (
    <View style={styles.container}>
      <SignupForm onSignupSuccess={handleSignupSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
});
