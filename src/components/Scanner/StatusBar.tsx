import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';

interface StatusBarProps {
  progress: number; // Accepts progress as percentage (0 to 100)
}

export const StatusBar: React.FC<StatusBarProps> = ({ progress }) => {
  return (
    <MotiView
      from={{ translateY: -50 }}
      animate={{ translateY: 0 }}
      transition={{
        type: 'spring',
        damping: 20,
        mass: 0.8,
      }}
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading progress bar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={20}
      />
      <View style={styles.progressTrack}>
        <MotiView
          from={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: 'timing',
            duration: 1000,
          }}
          style={styles.progressBar}
        />
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressTrack: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
});
