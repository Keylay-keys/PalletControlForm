// src/components/Scanner/Animations/SuccessCelebration.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

export const SuccessCelebration = () => {
  return (
    <MotiView
      from={{
        opacity: 0,
      }}
      animate={{
        opacity: 0.8,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        type: 'timing',
        duration: 200,
      }}
      style={styles.container}
    >
      <MotiView
        from={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          damping: 15,
        }}
        style={styles.checkmark}
      >
        <Ionicons name="checkmark" size={32} color="#10B981" />
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});