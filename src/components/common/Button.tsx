// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  icon?: keyof typeof Ionicons.glyphMap; // Ensuring the icon is a valid Ionicons name
}

export const Button = ({ title, onPress, style, icon }: ButtonProps) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {icon && <Ionicons name={icon} size={24} color="white" />}
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 130,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
