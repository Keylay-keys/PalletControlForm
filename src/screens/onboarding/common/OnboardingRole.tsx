// src/screens/onboarding/OnboardingRole.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootParamList } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

type OnboardingRoleProps = {
  navigation: StackNavigationProp<RootParamList, 'OnboardingRole'>;
  route: RouteProp<RootParamList, 'OnboardingRole'>;
};

interface RoleOption {
  id: 'owner' | 'ownerWithTeam' | 'ownerOnly';
  title: string;
  description: string;
  available: boolean;
  icon: 'person' | 'people' | 'business';
}

export default function OnboardingRole({ navigation, route }: OnboardingRoleProps) {
  const { colors } = useTheme();
  const { email, routeNumber, verifiedPCF, password, userId } = route.params;

  const updateUserRole = async (selectedRole: 'owner' | 'ownerWithTeam' | 'ownerOnly') => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const db = getFirestore();
    await setDoc(doc(db, 'users', user.uid), {
      hasRoleSelected: true,
      isOwnerOnly: selectedRole === 'ownerOnly',
      role: selectedRole,
      updatedAt: serverTimestamp()
    }, { merge: true });
  };

  const handleRoleSelection = async (selectedRole: 'owner' | 'ownerWithTeam' | 'ownerOnly') => {
    try {
      await updateUserRole(selectedRole);
      
      navigation.navigate('OnboardingBusiness', {
        email,
        routeNumber,
        verifiedPCF: selectedRole !== 'ownerOnly',
        password,
        userId,
        isOwnerOnly: selectedRole === 'ownerOnly',
        role: selectedRole
      });
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update role. Please try again.');
    }
  };

  const roleOptions: RoleOption[] = [
    {
      id: 'owner',
      title: 'I run one or more routes myself',
      description: 'You own and operate one or more routes independently.',
      available: verifiedPCF === true,
      icon: 'person',
    },
    {
      id: 'ownerWithTeam',
      title: 'I run routes and have team members',
      description: 'You own and operate routes and manage team members working on other routes.',
      available: verifiedPCF === true,
      icon: 'people',
    },
    {
      id: 'ownerOnly',
      title: 'I oversee routes without working on them',
      description: "You manage routes and assign them to team members but don't operate them yourself.",
      available: true,
      icon: 'business',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Select Your Role
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Please select the option that best describes how you use Route Spark.
        </Text>

        {roleOptions.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleButton,
              { 
                backgroundColor: colors.cardBg,
                opacity: role.available ? 1 : 0.6
              }
            ]}
            onPress={() => handleRoleSelection(role.id)}
          >
            <View style={styles.roleContent}>
              <View style={styles.roleHeader}>
                <Ionicons 
                  name={role.icon} 
                  size={24} 
                  color={colors.primary} 
                  style={styles.roleIcon}
                />
                <Text style={[styles.roleTitle, { color: colors.textPrimary }]}>
                  {role.title}
                </Text>
              </View>
              <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
                {role.description}
              </Text>
            </View>
            {!role.available && (
              <View style={[styles.verificationBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.verificationText, { color: colors.textPrimary }]}>
                  Requires PCF Verification
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <Text style={[styles.note, { color: colors.textMuted }]}>
          Note: You can always update your role later in settings.
        </Text>
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
    lineHeight: 22,
  },
  roleButton: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  roleContent: {
    flex: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIcon: {
    marginRight: 12,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  roleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  verificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
