// src/components/Scanner/Animations/TransitionView.tsx
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

interface TransitionViewProps {
  show: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  from?: object;
  animate?: object;
  exit?: object;
  transition?: object;
}

export const TransitionView: React.FC<TransitionViewProps> = ({
  show,
  children,
  style,
  from = { opacity: 0, scale: 0.9 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0.9 },
  transition = { type: 'spring', damping: 15 }
}) => {
  return (
    <AnimatePresence>
      {show && (
        <MotiView
          from={from}
          animate={animate}
          exit={exit}
          transition={transition}
          style={[styles.container, style]}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});