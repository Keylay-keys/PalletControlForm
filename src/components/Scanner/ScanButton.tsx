// src/components/Scanner/ScanButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

type ScanButtonProps = {
  onPress: (uri: string) => Promise<void>; // Define the onPress prop
  scanning: boolean;                     // Define scanning state
};

export const ScanButton: React.FC<ScanButtonProps> = ({ onPress, scanning }) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => onPress('uri-placeholder')} // Pass URI when triggering
      disabled={scanning}
    >
      {scanning ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.text}>Scan PCF</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
