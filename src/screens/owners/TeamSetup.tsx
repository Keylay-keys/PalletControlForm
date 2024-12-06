// src/screens/owners/TeamSetup.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function TeamSetup({ navigation, route }: any) {
  const { colors } = useTheme();
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addTeamMember = () => {
    if (!emailInput.trim()) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (!validateEmail(emailInput.trim())) {
      Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
      return;
    }
    if (teamMembers.includes(emailInput.trim())) {
      Alert.alert('Error', 'This email is already added.');
      return;
    }
    setTeamMembers([...teamMembers, emailInput.trim()]);
    setEmailInput('');
    Alert.alert('Success', `Team member ${emailInput.trim()} added.`);
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter((member) => member !== email));
    Alert.alert('Removed', `Team member ${email} removed.`);
  };

  const handleContinue = () => {
    if (teamMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one team member before continuing.');
      return;
    }
    navigation.navigate('OnboardingBusiness', { teamMembers });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Team Setup</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>
        Add team members who will be managing routes.
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        placeholder="Enter Team Member Email"
        placeholderTextColor={colors.textSecondary}
        value={emailInput}
        onChangeText={setEmailInput}
        onSubmitEditing={addTeamMember}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={addTeamMember}
      >
        <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>Add Team Member</Text>
      </TouchableOpacity>

      {teamMembers.length === 0 ? (
        <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
          No team members added yet.
        </Text>
      ) : (
        teamMembers.map((member, index) => (
          <View
            key={index}
            style={[styles.teamMemberContainer, { backgroundColor: colors.cardBg }]}
          >
            <Text style={[styles.teamMemberText, { color: colors.textPrimary }]}>{member}</Text>
            <TouchableOpacity onPress={() => removeTeamMember(member)}>
              <Text style={[styles.removeButton, { color: colors.primary }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
        onPress={handleContinue}
      >
        <Text style={[styles.continueButtonText, { color: colors.textPrimary }]}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  input: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 16 },
  addButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },
  emptyMessage: { fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginTop: 16 },
  teamMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  teamMemberText: { fontSize: 16 },
  removeButton: { fontSize: 14, textDecorationLine: 'underline' },
  continueButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  continueButtonText: { fontSize: 16, fontWeight: 'bold' },
});
