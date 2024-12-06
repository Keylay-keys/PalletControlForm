// src/screens/onboarding/team-members/TeamMemberSetup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

export default function TeamMemberSetupScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { routeNumber, ownerEmail } = route.params;

  const [teamMembers, setTeamMembers] = useState<{ email: string; routeNumber: string }[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRoute, setNewMemberRoute] = useState(routeNumber || '');

  const addTeamMember = () => {
    if (!newMemberEmail.trim() || !newMemberRoute.trim()) {
      Alert.alert('Error', 'Please fill out both fields.');
      return;
    }

    if (teamMembers.some((member) => member.email === newMemberEmail.trim())) {
      Alert.alert('Error', 'This team member has already been added.');
      return;
    }

    setTeamMembers([
      ...teamMembers,
      { email: newMemberEmail.trim(), routeNumber: newMemberRoute.trim() },
    ]);
    setNewMemberEmail('');
    setNewMemberRoute('');
  };

  const handleContinue = () => {
    if (teamMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one team member.');
      return;
    }

    navigation.navigate('VerificationPending', { teamMembers });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Team Setup</Text>

      <TextInput
        style={[styles.input, { borderColor: colors.border }]}
        placeholder="Team Member Email"
        placeholderTextColor={colors.textSecondary}
        value={newMemberEmail}
        onChangeText={setNewMemberEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { borderColor: colors.border }]}
        placeholder="Route Number"
        placeholderTextColor={colors.textSecondary}
        value={newMemberRoute}
        onChangeText={setNewMemberRoute}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={addTeamMember}
      >
        <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>Add Team Member</Text>
      </TouchableOpacity>

      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={[styles.memberItem, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.memberEmail, { color: colors.textPrimary }]}>
              {item.email} (Route {item.routeNumber})
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
        onPress={handleContinue}
      >
        <Text style={[styles.continueButtonText, { color: colors.textPrimary }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 16 },
  addButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
  memberItem: { padding: 12, borderRadius: 8, marginBottom: 8 },
  memberEmail: { fontSize: 16 },
  continueButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  continueButtonText: { fontSize: 16, fontWeight: 'bold' },
});
