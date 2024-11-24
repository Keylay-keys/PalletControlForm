import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [routeNumber, setRouteNumber] = useState('');

  const handleLogin = async () => {
    console.log('Login button pressed');

    if (!routeNumber.trim()) {
      alert('Please enter a valid Route Number');
      return;
    }

    try {
      const response = await fetch('http://10.0.0.45:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeNumber }),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (result.success) {
        console.log('Login successful');
        onLoginSuccess(result.user); // Call the success handler instead of navigating directly
      } else {
        console.log('Login failed with message:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error connecting to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Logic</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Route Number"
          placeholderTextColor="#94a3b8" // Match placeholder to the dark theme
          value={routeNumber}
          onChangeText={setRouteNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark background
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#660000', // Dark header background
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Border to separate header
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e2e8f0', // Light text color for the title
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    backgroundColor: '#1e293b', // Dark input background
    borderWidth: 1,
    borderColor: '#334155', // Subtle border for the input
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#e2e8f0', // Light text color for input
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#660000', // Bright blue for the button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff', // White text for the button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
