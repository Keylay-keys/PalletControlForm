// RoleSelectionScreen.tsx
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type RoleSelectionScreenNavigationProp = StackNavigationProp<RootParamList, 'RoleSelection'>;

export default function RoleSelectionScreen() {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const { colors } = useTheme();

  const handleRoleSelection = (role: 'owner' | 'ownerOnly' | 'ownerWithTeam') => {
    if (role === 'owner') {
      navigation.navigate('OwnerOnboarding', { hasTeamMembers: false });
    } else if (role === 'ownerOnly') {
      navigation.navigate('OwnerOnlyOnboarding');
    } else if (role === 'ownerWithTeam') {
      navigation.navigate('OwnerOnboarding', { hasTeamMembers: true });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Text style={styles.description}>
        Please select the option that best describes how you use this app.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection('owner')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>I run one or more routes myself</Text>
        <Text style={styles.buttonSubtext}>
          You own and operate one or more routes independently.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection('ownerWithTeam')}
      >
        <Text style={styles.buttonText}>I run routes and have team members</Text>
        <Text style={styles.buttonSubtext}>
          You own and operate routes and manage team members working on other routes.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection('ownerOnly')}
      >
        <Text style={styles.buttonText}>
          I oversee routes without working on them
        </Text>
        <Text style={styles.buttonSubtext}>
          You manage routes and assign them to team members but don't operate them yourself.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const colors = {
  // Main theme colors
  primary: '#1EA896',      // Teal - main accent color
  secondary: '#57CC99',    // Mint green - secondary accent
  
  // Background colors
  background: '#1E1E1E',   // Dark gray - main background
  cardBg: '#2D2D2D',      // Lighter gray - for cards/inputs
  
  // Text colors
  textPrimary: '#FFFFFF',  // White - primary text
  textSecondary: '#BBBBBB', // Light gray - secondary text
  textMuted: '#808080',    // Muted text for descriptions
  
  // Border colors
  border: '#383838'        // Subtle borders
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.background,  // Changed from '#0f172a'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.textPrimary,  // Changed from '#ffffff'
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 28,
    color: colors.textMuted,  // Changed from '#6b7280'
  },
  button: {
    backgroundColor: colors.cardBg,
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  buttonSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});