import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

interface ActionBarProps {
  onScan: () => void;
  onDocuments: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onScan, onDocuments }) => {
  return (
    <MotiView 
      style={styles.actionContainer}
      from={{ translateY: 100, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: '#4F46E5' }]}
        onPress={onScan}
        accessibilityRole="button"
        accessibilityLabel="Start scan"
      >
        <Ionicons name="scan" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: '#10B981' }]}
        onPress={onDocuments}
        accessibilityRole="button"
        accessibilityLabel="View documents"
      >
        <Ionicons name="documents" size={24} color="#FFF" />
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
