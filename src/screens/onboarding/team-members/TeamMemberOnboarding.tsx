// src/screens/onboarding/TeamMemberOnboarding.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootParamList, TeamMemberInvite } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

type TeamMemberOnboardingProps = {
  navigation: StackNavigationProp<RootParamList, 'TeamMemberOnboarding'>;
  route: RouteProp<RootParamList, 'TeamMemberOnboarding'>;
};

export default function TeamMemberOnboarding({ navigation }: TeamMemberOnboardingProps) {
  const { colors } = useTheme();
  const [inviteCode, setInviteCode] = useState('');

  // Function to verify the invite code
  const verifyInviteCode = async (code: string): Promise<TeamMemberInvite> => {
    const db = getFirestore();
    const inviteRef = doc(db, 'invites', code);
    const inviteDoc = await getDoc(inviteRef);

    if (!inviteDoc.exists()) {
      throw new Error('Invalid invite code');
    }

    return inviteDoc.data() as TeamMemberInvite;
  };

  const handleInviteVerification = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code.');
      return;
    }

    try {
      const invite: TeamMemberInvite = await verifyInviteCode(inviteCode.trim());

      if (invite.type === 'pcf_upload') {
        navigation.navigate('OnboardingPCF', {
          routeNumber: invite.routeNumber,
          email: invite.ownerEmail,
          password: '', // Provide an empty string or a placeholder if password is optional
          isTeamMember: true,
        });
      } else if (invite.type === 'route_operator') {
        navigation.navigate('TeamMemberSetup', {
          routeNumber: invite.routeNumber,
          ownerEmail: invite.ownerEmail,
        });
      } else {
        Alert.alert('Error', 'Invalid invite type.');
      }
    } catch (error) {
      console.error('Invite Verification Error:', error);
      Alert.alert('Error', 'Failed to verify invite code.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Team Member Signup
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        placeholder="Enter Invite Code"
        placeholderTextColor={colors.textSecondary}
        value={inviteCode}
        onChangeText={setInviteCode}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleInviteVerification}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          Continue
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
