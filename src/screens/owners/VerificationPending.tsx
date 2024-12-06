// src/screens/onboarding/owners/VerificationPending.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { sendTeamMemberInvite } from '@/utils/invitationUtils';

interface VerificationStatus {
  routeNumber: string;
  teamMemberEmail: string;
  status: 'pending' | 'verified';
  timestamp?: Date;
}

export default function VerificationPending() {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootParamList, 'VerificationPending'>>();
  const route = useRoute<any>();
  const [verifications, setVerifications] = useState<VerificationStatus[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(
      doc(db, 'verifications', route.params.userId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setVerifications(data.routeVerifications || []);

          const allVerified = (data.routeVerifications || []).every(
            (v: VerificationStatus) => v.status === 'verified'
          );

          if (allVerified) {
            handleAllVerificationsComplete();
          }
        }
      }
    );

    return () => unsubscribe();
  }, [route.params.userId]);

  const handleAllVerificationsComplete = () => {
    navigation.navigate('OnboardingBusiness', {
      email: route.params.email,
      routeNumber: '',
      role: route.params.role,
      isOwnerOnly: true,
      verifiedPCF: true,
      password: route.params.password,
      teamMembers: [],
    });
  };

  const resendInvite = async (teamMemberEmail: string, routeNumber: string) => {
    try {
      await sendTeamMemberInvite(teamMemberEmail, routeNumber, route.params.email);
      Alert.alert('Success', `Invitation resent successfully to ${teamMemberEmail} for Route ${routeNumber}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend invitation. Please try again later.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Pending Verifications
      </Text>

      <Text style={[styles.description, { color: colors.textMuted }]}>
        The following routes are waiting for PCF verification from team members.
        You'll be notified when all verifications are complete.
      </Text>

      <FlatList
        data={verifications}
        keyExtractor={(item) => item.routeNumber}
        renderItem={({ item }) => (
          <View style={[styles.verificationItem, { backgroundColor: colors.cardBg }]}>
            <View>
              <Text style={[styles.routeNumber, { color: colors.textPrimary }]}>
                Route {item.routeNumber}
              </Text>
              <Text style={[styles.email, { color: colors.textSecondary }]}>
                Pending: {item.teamMemberEmail}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => resendInvite(item.teamMemberEmail, item.routeNumber)}
            >
              <Text style={[styles.resendText, { color: colors.primary }]}>
                Resend Invite
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  verificationItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 8, marginBottom: 12 },
  routeNumber: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, marginTop: 4 },
  resendButton: { padding: 8 },
  resendText: { fontSize: 14, textDecorationLine: 'underline' },
});
