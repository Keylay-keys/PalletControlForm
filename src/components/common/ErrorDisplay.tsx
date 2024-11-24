// src/components/common/ErrorDisplay.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorDisplay = ({ message, onDismiss }: ErrorDisplayProps) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity onPress={onDismiss}>
      <Ionicons name="close-circle" size={24} color="#FF4444" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    flex: 1,
    color: '#CC0000',
    marginRight: 10,
  },
});