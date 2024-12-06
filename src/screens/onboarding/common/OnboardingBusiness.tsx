// src/screens/onboarding/OnboardingBusiness.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootParamList, TeamMemberInitial } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

type OnboardingBusinessProps = {
  navigation: StackNavigationProp<RootParamList, 'OnboardingBusiness'>;
  route: RouteProp<RootParamList, 'OnboardingBusiness'>;
};

export default function OnboardingBusiness({ navigation, route }: OnboardingBusinessProps) {
  const { colors } = useTheme();
  const { email, password, role, userId } = route.params;

  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessState, setBusinessState] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMemberInitial[]>([]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRoute, setNewMemberRoute] = useState('');

  const addTeamMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberRoute.trim()) {
      Alert.alert('Error', 'Please fill in all team member fields');
      return;
    }

    if (teamMembers.some(member => member.email === newMemberEmail.trim())) {
      Alert.alert('Error', 'This email is already added');
      return;
    }

    const newMember: TeamMemberInitial = {
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      routeNumber: newMemberRoute.trim(),
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRoute('');
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member.email !== email));
  };

  const handleContinue = async () => {
    try {
      if (!businessName.trim() || !businessPhone.trim() || !businessState.trim()) {
        Alert.alert('Error', 'Please enter all business details');
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        businessName: businessName.trim(),
        businessPhone: businessPhone.trim(),
        businessState: businessState.trim(),
        onboardingComplete: true,
        hasTeam: teamMembers.length > 0,
        teamMembers: teamMembers.length > 0 ? teamMembers : [],
        updatedAt: serverTimestamp()
      }, { merge: true });

      const initialView = route.params.isOwnerOnly ? 'management' : 'operator';
      navigation.navigate('Dashboard', { initialView });
    } catch (error) {
      console.error('Error saving business details:', error);
      Alert.alert('Error', 'Failed to save business details');
    }
  };

  const handleAdditionalRoutes = () => {
    const routeNumber = '';
    const verifiedPCF = false;
  
    if (!userId) {
      Alert.alert('Error', 'User ID is required to proceed.');
      return;
    }
  
    navigation.navigate('AdditionalRoutes', {
      email,
      role,
      hasTeam: teamMembers.length > 0,
      routeNumber,
      verifiedPCF,
      password,
      userId,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Business Details
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          {role === 'owner'
            ? 'Please provide your business information.'
            : 'Please provide your business information and at least one team member who can verify your ownership.'}
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
          ]}
          placeholder="Business Name"
          placeholderTextColor={colors.textSecondary}
          value={businessName}
          onChangeText={setBusinessName}
        />

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
          ]}
          placeholder="Business Phone"
          placeholderTextColor={colors.textSecondary}
          value={businessPhone}
          onChangeText={setBusinessPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
          ]}
          placeholder="Business State"
          placeholderTextColor={colors.textSecondary}
          value={businessState}
          onChangeText={setBusinessState}
        />

        {role !== 'owner' && (
          <View style={styles.teamSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Add Team Members
            </Text>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
              ]}
              placeholder="Team Member Name"
              placeholderTextColor={colors.textSecondary}
              value={newMemberName}
              onChangeText={setNewMemberName}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
              ]}
              placeholder="Team Member Email"
              placeholderTextColor={colors.textSecondary}
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary },
              ]}
              placeholder="Team Member Route Number"
              placeholderTextColor={colors.textSecondary}
              value={newMemberRoute}
              onChangeText={setNewMemberRoute}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addTeamMember}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                Add Team Member
              </Text>
            </TouchableOpacity>

            {teamMembers.map((member, index) => (
              <View key={index} style={[styles.memberItem, { backgroundColor: colors.cardBg }]}>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.textPrimary }]}>{member.name}</Text>
                  <Text style={[styles.memberDetails, { color: colors.textSecondary }]}>
                    {member.email} • Route {member.routeNumber}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeTeamMember(member.email)} style={styles.removeButton}>
                  <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.additionalRoutesButton, { backgroundColor: colors.primary }]}
          onPress={handleAdditionalRoutes}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Add Additional Routes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
    lineHeight: 22,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  teamSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  continueButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalRoutesButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});
