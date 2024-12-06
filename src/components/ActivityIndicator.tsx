// src/components/ActivityIndicator.tsx
import React from 'react';
import { ActivityIndicator as RNActivityIndicator, StyleSheet, View, Text } from 'react-native';

interface CustomActivityIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  label?: string;
}

export const ActivityIndicator: React.FC<CustomActivityIndicatorProps> = ({
  size = 'large',
  color = '#4F46E5',
  label,
}) => {
  return (
    <View style={styles.container}>
      <RNActivityIndicator size={size} color={color} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
  },
});
