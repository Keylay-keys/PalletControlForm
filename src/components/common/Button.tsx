// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean; // Replaces `scanning` to generalize
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  icon,
  disabled = false,
  loading = false,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      style,
      disabled && styles.disabledButton,
      loading && styles.loadingButton,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {icon && <Ionicons name={icon} size={24} color="white" />}
    <Text style={styles.buttonText}>{loading ? 'Processing...' : title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
