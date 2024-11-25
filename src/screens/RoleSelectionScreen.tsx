import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelectionScreen() {
  const navigation = useNavigation();

  const handleRoleSelection = (role: string) => {
    if (role === 'owner') {
      navigation.navigate('OwnerOnboarding');
    } else if (role === 'teamMember') {
      navigation.navigate('TeamMemberOnboarding');
    } else if (role === 'ownerOnly') {
      navigation.navigate('OwnerOnlyOnboarding');
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
      >
        <Text style={styles.buttonText}>I run one or more routes myself</Text>
        <Text style={styles.buttonSubtext}>
          You own and operate one or more routes independently.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection('teamMember')}
      >
        <Text style={styles.buttonText}>I work on a route assigned to me</Text>
        <Text style={styles.buttonSubtext}>
          You assist with tasks on a route assigned to you by an owner.
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
          You manage routes and assign them to team members but don’t operate them yourself.
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#660000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 4,
  },
});
