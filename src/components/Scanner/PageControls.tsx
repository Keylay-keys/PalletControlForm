// src/components/Scanner/PageControls.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';

interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageControls: React.FC<PageControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <View style={styles.container}>
      <BlurView style={styles.controls} blurType="dark" blurAmount={10}>
        <TouchableOpacity
          style={[styles.button, currentPage === 1 && styles.disabledButton]}
          onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentPage === 1 ? '#64748B' : '#FFFFFF'}
          />
        </TouchableOpacity>

        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          style={[styles.button, currentPage === totalPages && styles.disabledButton]}
          onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentPage === totalPages ? '#64748B' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Backup for non-iOS devices
  },
  button: {
    padding: 12,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
