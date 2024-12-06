// src/components/Scanner/ProcessingDisplay.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';
import { ActivityIndicator } from 'react-native'; // Use React Native's built-in ActivityIndicator

interface ProcessingDisplayProps {
  visible: boolean;
}

export const ProcessingDisplay: React.FC<ProcessingDisplayProps> = ({
  visible,
}) => {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ type: 'timing', duration: 150 }}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      <BlurView
        style={styles.blur}
        blurType="dark"
        blurAmount={3}
      >
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Processing PCF</Text>
            <Text style={styles.subtitle}>
              Detecting order number, container code, and line items...
            </Text>
          </View>
        </View>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    ...StyleSheet.absoluteFillObject, // Use absoluteFillObject to allow extensions
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Add fallback background
  },
  content: {
    alignItems: 'center',
    marginBottom: 16, // Adjust layout
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
});
