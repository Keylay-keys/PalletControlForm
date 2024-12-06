// src\screens\onboarding\common\OnboardingVerification.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootParamList } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { 
  getAuth, 
  sendEmailVerification 
} from 'firebase/auth';
import { OnboardingStore } from '@/services/OnboardingStore';

// Define styles before the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 16,
    padding: 12,
  },
  resendText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
  },
  backText: {
    fontSize: 14,
  },
});

type OnboardingVerificationProps = {
  navigation: StackNavigationProp<RootParamList, 'OnboardingVerification'>;
  route: RouteProp<RootParamList, 'OnboardingVerification'>;
};

export default function OnboardingVerification({ navigation, route }: OnboardingVerificationProps) {
  const { colors } = useTheme();
  const { email } = route.params;

  const [emailSent, setEmailSent] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);


  const sendVerificationEmail = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }
  
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
      await sendEmailVerification(user);
      setEmailSent(true);
      Alert.alert('Success', 'Verification email sent');
    } catch (error) {
      if (error instanceof Error && error.message.includes('too-many-requests')) {
        Alert.alert(
          'Notice', 
          'A verification email was already sent. Please check your inbox or try again in a few minutes.'
        );
        setEmailSent(true); // Enable resend button after timeout
      } else {
        Alert.alert('Error', 'Failed to send verification email');
      }
    }
  };
  
  

  const checkVerificationStatus = async () => {
    setCheckingStatus(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }
  
      await user.reload();
  
      if (user.emailVerified) {
        // Fetch stored data from OnboardingStore
        const verificationData = await OnboardingStore.get();
        const password = verificationData?.password || '';
        const routeNumber = route.params.routeNumber || ''; // Ensure routeNumber is a string
  
        // Navigate to OnboardingPCF with validated routeNumber
        navigation.navigate('OnboardingPCF', {
          email: email.trim(),
          routeNumber, // Guaranteed to be a string
          password,
          isTeamMember: false,
        });
      } else {
        Alert.alert('Not Verified', 'Please verify your email before continuing');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      Alert.alert('Error', 'Failed to check verification status');
    } finally {
      setCheckingStatus(false);
    }
  };
  
  
  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Verify Your Email
      </Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>
        We've sent a verification link to:
        {'\n\n'}
        <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>
          {email}
        </Text>
        {'\n\n'}
        Please check your email and click the verification link to continue.
      </Text>

      {checkingStatus && <ActivityIndicator size="large" color={colors.primary} />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={checkVerificationStatus}
          disabled={checkingStatus}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            {checkingStatus ? 'Checking...' : 'I\'ve Verified My Email'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={sendVerificationEmail}
          disabled={!emailSent}
        >
          <Text style={[styles.resendText, { color: colors.textSecondary }]}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: colors.textMuted }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
