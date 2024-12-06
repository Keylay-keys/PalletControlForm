import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

type TeamSetupProps = {
  route: {
    params: {
      routes: string[];
      ownerType: 'owner' | 'ownerOnly';
    };
  };
  navigation: any;
};

export default function TeamSetup({ route, navigation }: TeamSetupProps) {
  const { routes, ownerType } = route.params;

  const [teamEmails, setTeamEmails] = useState<{ [key: string]: string[] }>(
    routes.reduce((acc, route) => {
      acc[route] = [];
      return acc;
    }, {} as { [key: string]: string[] })
  );

  const [newEmail, setNewEmail] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(routes[0]); // Default to the first route

  const handleAddTeamMember = () => {
    if (!newEmail.trim()) {
      Alert.alert('Error', 'Enter a valid email.');
      return;
    }

    if (teamEmails[selectedRoute]?.includes(newEmail.trim())) {
      Alert.alert('Error', 'This email is already added for the selected route.');
      return;
    }

    setTeamEmails((prev) => ({
      ...prev,
      [selectedRoute]: [...(prev[selectedRoute] || []), newEmail.trim()],
    }));

    setNewEmail('');
    Alert.alert('Success', `${newEmail.trim()} has been added to route ${selectedRoute}.`);
  };

  const handleSubmit = () => {
    console.log('Final Team Emails:', teamEmails);

    Alert.alert('Success', 'Team members have been set up.');
    navigation.navigate('Dashboard'); // Navigate to Dashboard or next step
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Setup</Text>
      <Text style={styles.description}>
        {ownerType === 'ownerOnly'
          ? 'Assign team members to manage your routes.'
          : 'Assign team members to assist with your routes.'}
      </Text>

      <FlatList
        data={routes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.routeItem,
              selectedRoute === item && styles.selectedRouteItem,
            ]}
            onPress={() => setSelectedRoute(item)}
          >
            <Text style={styles.routeText}>{item}</Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.selectedRouteText}>Selected Route: {selectedRoute}</Text>

      <TextInput
        style={styles.input}
        placeholder="Team Member Email"
        placeholderTextColor="#94a3b8"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTeamMember}>
        <Text style={styles.addButtonText}>Add Team Member</Text>
      </TouchableOpacity>

      <FlatList
        data={teamEmails[selectedRoute] || []}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Text style={styles.listItem}>Team Member: {item}</Text>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  title: { fontSize: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  routeItem: { padding: 12, backgroundColor: '#1e293b', borderRadius: 8, marginHorizontal: 8 },
  selectedRouteItem: { borderColor: '#10b981', borderWidth: 2 },
  routeText: { color: '#ffffff', fontSize: 16 },
  selectedRouteText: { color: '#ffffff', fontSize: 16, marginVertical: 8, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#e2e8f0', padding: 12, borderRadius: 8, marginBottom: 16 },
  addButton: { backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addButtonText: { color: '#ffffff', textAlign: 'center', fontSize: 14 },
  listItem: { color: '#ffffff', fontSize: 14, marginBottom: 8 },
  submitButton: { backgroundColor: '#660000', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
