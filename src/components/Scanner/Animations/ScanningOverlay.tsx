// src/components/Scanner/Animations/ScanningOverlay.tsx
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface ScanningOverlayProps {
  visible: boolean;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ visible }) => {
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 300,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => animation.stop(); // Clean up animation when component unmounts or visibility changes
    }
  }, [visible, translateY]);

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      style={styles.overlay}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.scanLine,
            {
              transform: [{ translateY }],
            },
          ]}
        />
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    height: 2,
    backgroundColor: '#4F46E5',
    width: '100%',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
