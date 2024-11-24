import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '../navigation';

export default function IntroScreen() {
  const { navigate } = useNavigation();

  const handleGetStarted = () => {
    navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Route Logic</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.text}>
          Here's how to use the app:
          {'\n'}- Track your expiring items.
          {'\n'}- View analytics.
          {'\n'}- Use scanning for easy item entry.
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
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
    backgroundColor: '#660000', // Slightly lighter dark header background
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Subtle border for separation
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0', // Light text for header title
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#94a3b8', // Subtle light gray for body text
  },
  bottomBar: {
    padding: 16,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#660000', // Bright blue button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  getStartedButtonText: {
    color: '#fff', // White text for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});
