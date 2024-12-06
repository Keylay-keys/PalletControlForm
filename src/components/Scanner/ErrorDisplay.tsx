// src/components/Scanner/ErrorDisplay.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onDismiss,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'spring',
        damping: 20,
      }}
      style={styles.container}
    >
      <BlurView style={styles.blur} blurType="dark" blurAmount={10}>
        <View style={styles.content}>
          <Ionicons name="alert-circle" size={24} color="#EF4444" />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Added a fallback in case blur doesn't render
  },
  blur: {
    flex: 1, // Ensure the blur view covers the content
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items properly
    padding: 16, // Ensure consistent padding
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    marginHorizontal: 12, // Add space between icon and text
  },
  dismissButton: {
    padding: 8, // Ensure better touchable area
  },
});
