import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types'; // Update the path based on your project structure

type PendingReviewScreenNavigationProp = StackNavigationProp<RootParamList, 'PendingReview'>;

export default function PendingReviewScreen() {
  const navigation = useNavigation<PendingReviewScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verified!</Text>

      <Text style={styles.message}>
        Thank you for verifying your email. Your account is now pending review.
      </Text>

      <Text style={styles.details}>
        We need to verify your route number before you can continue.
        This usually takes 1-2 business days.
      </Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.buttonText}>Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#660000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
