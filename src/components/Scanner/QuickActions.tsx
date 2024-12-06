// src/components/Scanner/QuickActions.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionsProps {
  onNewOrder: () => void;
  onNewContainer: () => void;
  visible: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewOrder,
  onNewContainer,
  visible
}) => (
  <MotiView
    from={{ opacity: 0, translateY: 20 }}
    animate={{ 
      opacity: visible ? 1 : 0,
      translateY: visible ? 0 : 20
    }}
    transition={{ type: 'timing', duration: 300 }}
    style={styles.container}
  >
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onNewOrder}
    >
      <Ionicons name="document-outline" size={24} color="#4F46E5" />
      <Text style={styles.actionText}>New Order</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onNewContainer}
    >
      <Ionicons name="cube-outline" size={24} color="#4F46E5" />
      <Text style={styles.actionText}>New Container</Text>
    </TouchableOpacity>
  </MotiView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionText: {
    color: '#4F46E5',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});