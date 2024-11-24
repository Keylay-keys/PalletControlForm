// src/components/Scanner/ScanButton.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScanButtonProps {
  onPress: () => void;
  scanning: boolean;
}

export const ScanButton = ({ onPress, scanning }: ScanButtonProps) => (
  <TouchableOpacity
    style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
    onPress={onPress}
    disabled={scanning}
  >
    {scanning ? (
      <Text style={styles.scanButtonText}>Scanning...</Text>
    ) : (
      <>
        <Ionicons name="scan" size={48} color="white" />
        <Text style={styles.scanButtonText}>Scan PCF</Text>
      </>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: '#660000',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },
  scanButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
});