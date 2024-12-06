// src/components/Scanner/Animations/LoadingAnimation.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

export const LoadingAnimation = () => {
  return (
    <MotiView style={styles.container}>
      {/* Primary scanning beam */}
      <MotiView
        from={{
          translateY: -100,
          opacity: 0,
        }}
        animate={{
          translateY: 400,
          opacity: 1,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }}
        style={styles.scanBeam}
      />
      
      {/* Success celebration particles */}
      {Array.from({ length: 12 }).map((_, index) => (
        <MotiView
          key={index}
          from={{
            scale: 0,
            opacity: 0,
            translateX: 0,
            translateY: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            translateX: Math.cos(index * 30) * 100,
            translateY: Math.sin(index * 30) * 100,
          }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 2000,
            delay: index * 100,
          }}
          style={[styles.particle, { backgroundColor: getParticleColor() }]}
        />
      ))}
    </MotiView>
  );
};

const getParticleColor = () => {
  const colors = ['#4F46E5', '#10B981', '#3B82F6', '#6366F1'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scanBeam: {
    width: '100%',
    height: 2,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});